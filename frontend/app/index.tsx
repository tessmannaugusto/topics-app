import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, ActivityIndicator, Alert, Platform } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { getTopics, Topic, saveTopic } from '../src/storage/topic-storage';
import * as FileSystem from 'expo-file-system/legacy';
import { useAudio } from '../src/context/AudioContext';
import { API_URL } from '../src/config';
import { styles } from './index.styles';

export default function TopicList() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [generatingIds, setGeneratingIds] = useState<Set<string>>(new Set());
  
  const { isPlaying, currentTopicId, playSound, pauseSound, stopSound } = useAudio();
  
  const router = useRouter();

  const loadTopics = async () => {
    const data = await getTopics();
    setTopics(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadTopics();
    }, [])
  );

  const handleGenerateAudio = async (topic: Topic) => {
    if (!topic.aiScript) {
      Alert.alert('No Script', 'Please generate an AI script in the topic detail first.');
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
      
      if (Platform.OS === 'web') {
        const blobUrl = URL.createObjectURL(blob);
        const updatedTopic = { ...topic, audioFileUri: blobUrl };
        await saveTopic(updatedTopic);
        loadTopics();
        if (currentTopicId === topic.id) await stopSound();
        Alert.alert('Success', `Audio for "${topic.name}" is ready!`);
      } else {
        const fileUri = `${FileSystem.documentDirectory}${topic.id}.mp3`;
        const reader = new FileReader();
        reader.onload = async () => {
          const base64data = (reader.result as string).split(',')[1];
          await FileSystem.writeAsStringAsync(fileUri, base64data, {
            encoding: FileSystem.EncodingType.Base64,
          });
          
          const updatedTopic = { ...topic, audioFileUri: fileUri };
          await saveTopic(updatedTopic);
          loadTopics();
          if (currentTopicId === topic.id) await stopSound();
          Alert.alert('Success', `Audio for "${topic.name}" is ready!`);
        };
        reader.readAsDataURL(blob);
      }

    } catch (error: any) {
      Alert.alert('Error', error.message);
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

  const renderItem = ({ item }: { item: Topic }) => (
    <View style={styles.topicItemContainer}>
      <TouchableOpacity
        style={styles.topicInfo}
        activeOpacity={0.7}
        onPress={() => router.push(`/${item.id}`)}
      >
        <Text style={styles.topicName}>{item.name}</Text>
        <Text style={styles.topicDate}>{new Date(item.dateCreated).toLocaleDateString()}</Text>
      </TouchableOpacity>

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
    </View>
  );

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
      
      <TouchableOpacity 
        style={styles.fab}
        activeOpacity={0.9}
        onPress={() => router.push('/create')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}
