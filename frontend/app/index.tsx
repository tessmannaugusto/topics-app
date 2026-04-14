import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { getTopics, Topic, saveTopic } from '../src/storage/topic-storage';
import * as FileSystem from 'expo-file-system/legacy';
import { Audio } from 'expo-av';
import { API_URL } from '../src/config';
import { styles } from './index.styles';

export default function TopicList() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [generatingIds, setGeneratingIds] = useState<Set<string>>(new Set());
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const router = useRouter();

  const loadTopics = async () => {
    const data = await getTopics();
    setTopics(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadTopics();
      return () => {
        if (sound) {
          sound.unloadAsync();
        }
      };
    }, [sound])
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

      const fileUri = `${FileSystem.documentDirectory}${topic.id}.mp3`;
      const blob = await response.blob();
      const reader = new FileReader();
      
      reader.onload = async () => {
        const base64data = (reader.result as string).split(',')[1];
        await FileSystem.writeAsStringAsync(fileUri, base64data, {
          encoding: FileSystem.EncodingType.Base64,
        });
        
        const updatedTopic = { ...topic, audioFileUri: fileUri };
        await saveTopic(updatedTopic);
        loadTopics(); // Refresh list
        Alert.alert('Success', `Audio for "${topic.name}" is ready!`);
      };
      reader.readAsDataURL(blob);

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

  const playSound = async (topic: Topic) => {
    if (!topic.audioFileUri) return;

    try {
      if (playingId === topic.id && sound) {
        await sound.pauseAsync();
        setPlayingId(null);
      } else {
        if (sound) {
          await sound.unloadAsync();
        }

        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: topic.audioFileUri },
          { shouldPlay: true }
        );
        
        setSound(newSound);
        setPlayingId(topic.id);
        
        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            setPlayingId(null);
          }
        });
      }
    } catch (error: any) {
      Alert.alert('Error playing sound', error.message);
    }
  };

  const renderItem = ({ item }: { item: Topic }) => (
    <View style={styles.topicItemContainer}>
      <TouchableOpacity
        style={styles.topicInfo}
        onPress={() => router.push(`/${item.id}`)}
      >
        <Text style={styles.topicName}>{item.name}</Text>
        <Text style={styles.topicDate}>{new Date(item.dateCreated).toLocaleDateString()}</Text>
      </TouchableOpacity>

      <View style={styles.audioControls}>
        {item.audioFileUri ? (
          <TouchableOpacity 
            style={[styles.audioButton, styles.playButton]} 
            onPress={() => playSound(item)}
          >
            <Text style={styles.buttonText}>
              {playingId === item.id ? "Pause" : "Play"}
            </Text>
          </TouchableOpacity>
        ) : item.aiScript ? (
          generatingIds.has(item.id) ? (
            <ActivityIndicator size="small" color="#4CAF50" />
          ) : (
            <TouchableOpacity 
              style={[styles.audioButton, styles.generateButton]} 
              onPress={() => handleGenerateAudio(item)}
            >
              <Text style={styles.buttonText}>Audio</Text>
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
        ListEmptyComponent={<Text style={styles.emptyText}>No topics yet.</Text>}
      />
      <View style={styles.buttonContainer}>
        <Button title="Create Topic" onPress={() => router.push('/create')} />
      </View>
    </View>
  );
}
