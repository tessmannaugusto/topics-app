import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Button, ScrollView, Alert, ActivityIndicator, TextInput, Platform, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { getTopicById, deleteTopic, saveTopic, Topic } from '../src/storage/topic-storage';
import { API_URL } from '../src/config';
import * as FileSystem from 'expo-file-system/legacy';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { styles } from './[id].styles';

// Helper for compatible alerts
const customAlert = (title: string, message: string, onConfirm?: () => void) => {
  if (Platform.OS === 'web') {
    if (onConfirm) {
      if (window.confirm(`${title}\n\n${message}`)) {
        onConfirm();
      }
    } else {
      window.alert(`${title}\n\n${message}`);
    }
  } else {
    if (onConfirm) {
      Alert.alert(title, message, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: onConfirm },
      ]);
    } else {
      Alert.alert(title, message);
    }
  }
};

export default function TopicDetail() {
  const { id } = useLocalSearchParams();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [instructions, setInstructions] = useState('');
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Audio player state
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);

  const router = useRouter();

  const loadTopic = async () => {
    if (typeof id === 'string') {
      const data = await getTopicById(id);
      if (data) {
        setTopic(data);
      } else {
        router.back();
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTopic();
      return () => {
        if (sound) {
          sound.unloadAsync();
        }
      };
    }, [id])
  );

  const handleGenerateScript = async () => {
    if (!topic) return;

    if (topic.aiScript) {
      customAlert(
        'Regenerate Script',
        'A script already exists. Do you want to overwrite it?',
        () => performGeneration()
      );
    } else {
      performGeneration();
    }
  };

  const performGeneration = async () => {
    if (!topic) return;
    setIsGenerating(true);

    try {
      const response = await fetch(`${API_URL}/generate-script`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: topic.name,
          notes: topic.notes,
          instructions: instructions,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const updatedTopic = { ...topic, aiScript: data.aiScript };
        await saveTopic(updatedTopic);
        setTopic(updatedTopic);
        setInstructions(''); // Clear instructions after success
        customAlert('Success', 'AI Script generated successfully!');
      } else {
        throw new Error(data.error || 'Failed to generate script');
      }
    } catch (error: any) {
      customAlert('Error', error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateAudio = async () => {
    if (!topic || !topic.aiScript) return;
    setIsGeneratingAudio(true);

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
        // Web: Use a temporary blob URL
        const blobUrl = URL.createObjectURL(blob);
        const updatedTopic = { ...topic, audioFileUri: blobUrl };
        await saveTopic(updatedTopic);
        setTopic(updatedTopic);
        
        if (sound) {
          await sound.unloadAsync();
          setSound(null);
          setIsPlaying(false);
        }
        customAlert('Success', 'Audio generated! (Temporary URL for web)');
      } else {
        // Mobile: Save to local filesystem
        const fileUri = `${FileSystem.documentDirectory}${topic.id}.mp3`;
        const reader = new FileReader();
        reader.onload = async () => {
          const base64data = (reader.result as string).split(',')[1];
          await FileSystem.writeAsStringAsync(fileUri, base64data, {
            encoding: FileSystem.EncodingType.Base64,
          });
          
          const updatedTopic = { ...topic, audioFileUri: fileUri };
          await saveTopic(updatedTopic);
          setTopic(updatedTopic);
          
          if (sound) {
            await sound.unloadAsync();
            setSound(null);
            setIsPlaying(false);
          }
          customAlert('Success', 'Audio generated and saved!');
        };
        reader.readAsDataURL(blob);
      }

    } catch (error: any) {
      customAlert('Error', error.message);
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis || 0);
      setIsPlaying(status.isPlaying);
      if (status.didJustFinish) {
        setIsPlaying(false);
        setPosition(0);
      }
    } else if (status.error) {
      console.error(`Playback Error: ${status.error}`);
    }
  };

  const playSound = async () => {
    if (!topic?.audioFileUri) return;

    try {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
        } else {
          await sound.playAsync();
        }
      } else {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: topic.audioFileUri },
          { shouldPlay: true },
          onPlaybackStatusUpdate
        );
        setSound(newSound);
      }
    } catch (error: any) {
      customAlert('Error playing sound', error.message);
    }
  };

  const formatTime = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${Number(seconds) < 10 ? '0' : ''}${seconds}`;
  };

  const handleSeek = async (value: number) => {
    if (sound) {
      await sound.setPositionAsync(value);
      setPosition(value);
    }
  };

  const handleDelete = async () => {
    customAlert(
      'Delete Topic',
      'Are you sure you want to delete this topic?',
      async () => {
        if (typeof id === 'string') {
          await deleteTopic(id);
          router.back();
        }
      }
    );
  };

  if (!topic) return null;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.name}>{topic.name}</Text>
      <Text style={styles.date}>Created: {new Date(topic.dateCreated).toLocaleString()}</Text>
      <Text style={styles.label}>Notes:</Text>
      <Text style={styles.notes}>{topic.notes || 'No notes provided.'}</Text>
      
      {topic.aiScript && (
        <>
          <Text style={styles.label}>AI Script:</Text>
          <Text style={styles.notes}>{topic.aiScript}</Text>
          
          <Text style={styles.label}>Regeneration Instructions (Optional):</Text>
          <TextInput
            style={styles.input}
            placeholder="Example: Make it 30% smaller, less fillers..."
            value={instructions}
            onChangeText={setInstructions}
            multiline
          />
        </>
      )}

      {topic.audioFileUri && (
        <View style={styles.audioSection}>
          <Text style={styles.label}>Audiobook ready!</Text>
          
          <View style={styles.playerControls}>
            <TouchableOpacity onPress={playSound} style={styles.playIconButton}>
              <Text style={styles.playIcon}>{isPlaying ? "⏸" : "▶️"}</Text>
            </TouchableOpacity>
            
            <View style={styles.progressContainer}>
              {Platform.OS === 'web' ? (
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={position}
                  onChange={(e) => handleSeek(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              ) : (
                <Text style={styles.notes}>Slider (Mobile Pending Library)</Text>
              )}
              <View style={styles.timeLabels}>
                <Text style={styles.timeText}>{formatTime(position)}</Text>
                <Text style={styles.timeText}>{formatTime(duration)}</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      <View style={styles.actions}>
        {isGenerating ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Button 
            title={topic.aiScript ? "Regenerate AI Script" : "Generate AI Script"} 
            onPress={handleGenerateScript}
            disabled={!topic.notes || topic.notes.trim().length === 0}
          />
        )}
        
        <View style={styles.spacer} />
        
        {topic.aiScript && (
          <>
            {isGeneratingAudio ? (
              <ActivityIndicator size="large" color="#4CAF50" />
            ) : (
              <Button 
                title={topic.audioFileUri ? "Regenerate Audio" : "Generate Audio"} 
                onPress={handleGenerateAudio}
                color="#4CAF50"
              />
            )}
            <View style={styles.spacer} />
          </>
        )}
        
        <Button title="Edit Topic" onPress={() => router.push(`/edit/${topic.id}`)} />
        <View style={styles.spacer} />
        <Button title="Delete Topic" color="red" onPress={handleDelete} />
      </View>
    </ScrollView>
  );
}
