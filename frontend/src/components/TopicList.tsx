import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { getTopics, Topic, saveTopic } from '../storage/topic-storage';
import { audioPersistence } from '../storage/audio-persistence';
import { useAudio } from '../context/AudioContext';
import { API_URL } from '../config';
import { styles } from '../../app/index.styles';

interface TopicListProps {
  onTopicSelect?: (topicId: string) => void;
  selectedTopicId?: string;
  isSidebar?: boolean;
  folderId?: string | null;
  showFab?: boolean;
  refreshTrigger?: number;
}

const customAlert = (title: string, message: string) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
  } else {
    // Native Alert can be imported from react-native if needed,
    // but for the component we'll keep it simple or pass it as a prop.
    console.log(`${title}: ${message}`);
  }
};

export const TopicList: React.FC<TopicListProps> = ({ 
  onTopicSelect, 
  selectedTopicId,
  isSidebar = false,
  folderId,
  showFab = true,
  refreshTrigger
}) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [generatingIds, setGeneratingIds] = useState<Set<string>>(new Set());
  
  const { isPlaying, currentTopicId, playSound, pauseSound, stopSound } = useAudio();
  
  const router = useRouter();

  const loadTopics = useCallback(async () => {
    let data = await getTopics();
    if (folderId !== undefined) {
      data = data.filter(t => t.folderId === (folderId || undefined));
    }
    setTopics(data);
  }, [folderId]);

  useFocusEffect(
    useCallback(() => {
      loadTopics();
    }, [loadTopics])
  );

  useEffect(() => {
    loadTopics();
  }, [loadTopics, refreshTrigger]);

  const handleGenerateAudio = async (topic: Topic) => {
    if (!topic.aiScript) {
      customAlert('No Script', 'Please generate an AI script in the topic detail first.');
      return;
    }

    setGeneratingIds(prev => new Set(prev).add(topic.id));

    try {
      const response = await fetch(`${API_URL}/generate-audio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: topic.id,
          script: topic.aiScript,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate audio');
      }

      const blob = await response.blob();
      
      // Use unified audio persistence
      const savedUri = await audioPersistence.saveAudio(topic.id, blob);
      
      const updatedTopic = { ...topic, audioFileUri: savedUri };
      await saveTopic(updatedTopic);
      loadTopics();
      
      if (currentTopicId === topic.id) {
        await stopSound();
      }
      
      customAlert('Success', `Audio for "${topic.name}" is ready!`);
    } catch (error: any) {
      customAlert('Error', error.message);
    } finally {
      setGeneratingIds(prev => {
        const next = new Set(prev);
        next.delete(topic.id);
        return next;
      });
    }
  };

  const togglePlayback = async (topic: Topic) => {
    if (!topic.audioFileUri) return;

    if (currentTopicId === topic.id && isPlaying) {
      await pauseSound();
    } else {
      await playSound(topic.id, topic.audioFileUri);
    }
  };

  const handlePress = (topic: Topic) => {
    if (onTopicSelect) {
      onTopicSelect(topic.id);
    } else {
      router.push(`/${topic.id}`);
    }
  };

  const renderItem = ({ item }: { item: Topic }) => {
    const isSelected = selectedTopicId === item.id;
    
    return (
      <View style={[
        styles.topicItemContainer, 
        isSelected && { backgroundColor: '#f0f0f0' } // Basic highlight for selection
      ]}>
        <TouchableOpacity
          style={styles.topicInfo}
          activeOpacity={0.7}
          onPress={() => handlePress(item)}
        >
          <Text style={styles.topicName}>{item.name}</Text>
          <Text style={styles.topicDate}>{new Date(item.dateCreated).toLocaleDateString()}</Text>
        </TouchableOpacity>

        {!isSidebar && (
          <View style={styles.audioControls}>
            {item.audioFileUri ? (
              <TouchableOpacity 
                style={[styles.audioButton, styles.playButton]} 
                activeOpacity={0.8}
                onPress={() => togglePlayback(item)}
              >
                <Text style={styles.buttonText}>
                  {currentTopicId === item.id && isPlaying ? "PAUSE" : "PLAY"}
                </Text>
              </TouchableOpacity>
            ) : item.aiScript ? (
              generatingIds.has(item.id) ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <TouchableOpacity 
                  style={[styles.audioButton, styles.generateButton]} 
                  activeOpacity={0.8}
                  onPress={() => handleGenerateAudio(item)}
                >
                  <Text style={styles.generateButtonText}>GENERATE</Text>
                </TouchableOpacity>
              )
            ) : null}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={topics}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.emptyText}>No topics yet.</Text>}
      />
      
      {!isSidebar && showFab && (
        <TouchableOpacity 
          style={styles.fab}
          activeOpacity={0.9}
          onPress={() => router.push(folderId ? `/create?folderId=${folderId}` : '/create')}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
