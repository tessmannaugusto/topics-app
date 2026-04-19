import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Button, ScrollView, Alert, ActivityIndicator, TextInput, Platform, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { getTopicById, deleteTopic, saveTopic, Topic } from '../src/storage/topic-storage';
import { API_URL } from '../src/config';
import * as FileSystem from 'expo-file-system/legacy';
import { useAudio } from '../src/context/AudioContext';
import { theme } from '../src/styles/theme';
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
  
  const { 
    isPlaying, 
    isSpeaking,
    currentTopicId, 
    position, 
    duration, 
    playSound, 
    pauseSound, 
    stopSound,
    seekSound,
    speakLocal,
    stopLocal
  } = useAudio();

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
        const blobUrl = URL.createObjectURL(blob);
        const updatedTopic = { ...topic, audioFileUri: blobUrl };
        await saveTopic(updatedTopic);
        setTopic(updatedTopic);
        
        if (currentTopicId === topic.id) {
          await stopSound();
        }
        customAlert('Success', 'Audio generated! (Temporary URL for web)');
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
          setTopic(updatedTopic);
          
          if (currentTopicId === topic.id) {
            await stopSound();
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

  const handleSpeakLocal = async () => {
    if (!topic || !topic.aiScript) return;
    
    if (currentTopicId === topic.id && isSpeaking) {
      await stopLocal();
    } else {
      await speakLocal(topic.id, topic.aiScript);
    }
  };

  const handleTogglePlay = async () => {
    if (!topic?.audioFileUri) return;

    if (currentTopicId === topic.id && isPlaying) {
      await pauseSound();
    } else {
      await playSound(topic.id, topic.audioFileUri);
    }
  };

  const handleDeleteAudio = async () => {
    if (!topic?.audioFileUri) return;

    customAlert(
      'Delete Audio',
      'Are you sure you want to delete the generated audio for this topic?',
      async () => {
        try {
          if (currentTopicId === topic.id) {
            await stopSound();
          }

          if (Platform.OS !== 'web' && topic.audioFileUri) {
            const fileInfo = await FileSystem.getInfoAsync(topic.audioFileUri);
            if (fileInfo.exists) {
              await FileSystem.deleteAsync(topic.audioFileUri);
            }
          }

          const updatedTopic = { ...topic, audioFileUri: undefined };
          await saveTopic(updatedTopic);
          setTopic(updatedTopic);
          customAlert('Success', 'Audio deleted successfully.');
        } catch (error: any) {
          customAlert('Error', 'Failed to delete audio: ' + error.message);
        }
      }
    );
  };

  const formatTime = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${Number(seconds) < 10 ? '0' : ''}${seconds}`;
  };

  const handleDelete = async () => {
    customAlert(
      'Delete Topic',
      'Are you sure you want to delete this topic?',
      async () => {
        if (typeof id === 'string') {
          if (currentTopicId === id) {
            await stopSound();
          }
          await deleteTopic(id);
          router.back();
        }
      }
    );
  };

  if (!topic) return null;

  const isCurrentPlaying = currentTopicId === topic.id;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.name}>{topic.name}</Text>
        <Text style={styles.date}>{new Date(topic.dateCreated).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Notes</Text>
        <Text style={styles.notes}>{topic.notes || 'No notes provided.'}</Text>
      </View>
      
      {topic.aiScript && (
        <View style={styles.section}>
          <Text style={styles.label}>AI Script</Text>
          <Text style={styles.notes}>{topic.aiScript}</Text>
          
          <View style={{ marginTop: theme.spacing.xl }}>
            <Text style={styles.label}>Refine script</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Make it more professional..."
              value={instructions}
              onChangeText={setInstructions}
              multiline
            />
          </View>
        </View>
      )}

      {topic.audioFileUri && (
        <View style={styles.audioSection}>
          <View style={styles.audioHeader}>
            <Text style={styles.audioTitle}>Audiobook</Text>
            <TouchableOpacity onPress={handleDeleteAudio} style={styles.deleteAudioButton}>
              <Text style={styles.deleteAudioText}>DELETE</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.playerControls}>
            <TouchableOpacity onPress={handleTogglePlay} style={styles.playIconButton} activeOpacity={0.8}>
              <Text style={isCurrentPlaying && isPlaying ? styles.pauseIcon : styles.playIcon}>
                {isCurrentPlaying && isPlaying ? "‖" : "▶"}
              </Text>
            </TouchableOpacity>
            
            <View style={styles.progressContainer}>
              {Platform.OS === 'web' ? (
                <input
                  type="range"
                  min="0"
                  max={isCurrentPlaying ? duration : 0}
                  value={isCurrentPlaying ? position : 0}
                  onChange={(e) => isCurrentPlaying && seekSound(Number(e.target.value))}
                  style={{ width: '100%', accentColor: theme.colors.primary }}
                />
              ) : (
                <View style={{ height: 2, backgroundColor: theme.colors.border, width: '100%' }}>
                   <View style={{ height: 2, backgroundColor: theme.colors.primary, width: isCurrentPlaying ? `${(position/duration)*100}%` : '0%' }} />
                </View>
              )}
              <View style={styles.timeLabels}>
                <Text style={styles.timeText}>{isCurrentPlaying ? formatTime(position) : "0:00"}</Text>
                <Text style={styles.timeText}>{isCurrentPlaying ? formatTime(duration) : "0:00"}</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      <View style={styles.actions}>
        {isGenerating ? (
          <ActivityIndicator size="small" color={theme.colors.primary} />
        ) : (
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleGenerateScript}
            disabled={!topic.notes || topic.notes.trim().length === 0}
          >
            <Text style={styles.primaryButtonText}>
              {topic.aiScript ? "REGENERATE SCRIPT" : "GENERATE SCRIPT"}
            </Text>
          </TouchableOpacity>
        )}
        
        {topic.aiScript && !topic.audioFileUri && (
          isGeneratingAudio ? (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          ) : (
            <>
              <TouchableOpacity style={styles.primaryButton} onPress={handleGenerateAudio}>
                <Text style={styles.primaryButtonText}>GENERATE AUDIO FILE</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={handleSpeakLocal}>
                <Text style={styles.secondaryButtonText}>
                  {currentTopicId === topic.id && isSpeaking ? "STOP AUDIO" : "PLAY AUDIO"}
                </Text>
              </TouchableOpacity>
            </>
          )
        )}

        {topic.audioFileUri && !isGeneratingAudio && (
           <TouchableOpacity style={styles.secondaryButton} onPress={handleGenerateAudio}>
              <Text style={styles.secondaryButtonText}>REGENERATE AUDIO</Text>
           </TouchableOpacity>
        )}
        
        <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push(`/edit/${topic.id}`)}>
          <Text style={styles.secondaryButtonText}>EDIT TOPIC</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dangerButton} onPress={handleDelete}>
          <Text style={styles.dangerButtonText}>DELETE TOPIC</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
