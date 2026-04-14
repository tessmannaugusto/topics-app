import React, { useState, useCallback } from 'react';
import { View, Text, Button, ScrollView, Alert, ActivityIndicator, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { getTopicById, deleteTopic, saveTopic, Topic } from '../src/storage/topic-storage';
import { API_URL } from '../src/config';
import * as FileSystem from 'expo-file-system/legacy';
import { Audio } from 'expo-av';
import { styles } from './[id].styles';

export default function TopicDetail() {
  const { id } = useLocalSearchParams();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [instructions, setInstructions] = useState('');
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
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
    }, [id, sound])
  );

  const handleGenerateScript = async () => {
    if (!topic) return;

    if (topic.aiScript) {
      Alert.alert(
        'Regenerate Script',
        'A script already exists. Do you want to overwrite it?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Overwrite', onPress: () => performGeneration() },
        ]
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
        Alert.alert('Success', 'AI Script generated successfully!');
      } else {
        throw new Error(data.error || 'Failed to generate script');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
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

      // Download the audio file
      const fileUri = `${FileSystem.documentDirectory}${topic.id}.mp3`;
      
      // We need to use base64 for now as expo-file-system downloadAsync 
      // is usually for GET. For POST with binary, we might need to handle it differently.
      // But since our backend returns binary, we'll try to use a blob/base64 approach.
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onload = async () => {
        const base64data = (reader.result as string).split(',')[1];
        await FileSystem.writeAsStringAsync(fileUri, base64data, {
          encoding: FileSystem.EncodingType.Base64,
        });
        
        const updatedTopic = { ...topic, audioFileUri: fileUri };
        await saveTopic(updatedTopic);
        setTopic(updatedTopic);
        Alert.alert('Success', 'Audio generated and saved!');
      };
      reader.readAsDataURL(blob);

    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const playSound = async () => {
    if (!topic?.audioFileUri) return;

    try {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      } else {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: topic.audioFileUri },
          { shouldPlay: true }
        );
        setSound(newSound);
        setIsPlaying(true);
        
        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            setIsPlaying(false);
          }
        });
      }
    } catch (error: any) {
      Alert.alert('Error playing sound', error.message);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete Topic',
      'Are you sure you want to delete this topic?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (typeof id === 'string') {
              await deleteTopic(id);
              router.back();
            }
          },
        },
      ]
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
          <Button 
            title={isPlaying ? "Pause Audio" : "Play Audio"} 
            onPress={playSound} 
            color="#4CAF50"
          />
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
