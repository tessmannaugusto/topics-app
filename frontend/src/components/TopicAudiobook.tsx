import React, { useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TextInput, Platform, TouchableOpacity, StyleSheet } from 'react-native';
import { Topic, saveTopic } from '../storage/topic-storage';
import { API_URL } from '../config';
import { audioPersistence } from '../storage/audio-persistence';
import { useAudio } from '../context/AudioContext';
import { theme } from '../styles/theme';

interface TopicAudiobookProps {
  topic: Topic;
  onUpdateTopic: (updatedTopic: Topic) => void;
  customAlert: (title: string, message: string, onConfirm?: () => void) => void;
}

export const TopicAudiobook: React.FC<TopicAudiobookProps> = ({ 
  topic, 
  onUpdateTopic,
  customAlert 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [instructions, setInstructions] = useState('');
  
  const { 
    isPlaying, 
    currentTopicId, 
    position, 
    duration, 
    playSound, 
    pauseSound, 
    stopSound,
    seekSound,
    speakLocal,
    isSpeaking,
    stopLocal
  } = useAudio();

  const handleGenerateScript = async () => {
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
        onUpdateTopic(updatedTopic);
        setInstructions('');
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
    if (!topic.aiScript) return;
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
      const savedUri = await audioPersistence.saveAudio(topic.id, blob);
      
      const updatedTopic = { ...topic, audioFileUri: savedUri };
      await saveTopic(updatedTopic);
      onUpdateTopic(updatedTopic);
      
      if (currentTopicId === topic.id) {
        await stopSound();
      }
      
      customAlert('Success', 'Audio generated and saved!');
    } catch (error: any) {
      customAlert('Error', error.message);
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const handleTogglePlay = async () => {
    if (!topic.audioFileUri) return;

    if (currentTopicId === topic.id && isPlaying) {
      await pauseSound();
    } else {
      await playSound(topic.id, topic.audioFileUri);
    }
  };

  const handleSpeakLocal = async () => {
    if (!topic.aiScript) return;
    
    if (currentTopicId === topic.id && isSpeaking) {
      await stopLocal();
    } else {
      await speakLocal(topic.id, topic.aiScript);
    }
  };

  const handleDownload = async () => {
    if (Platform.OS !== 'web') return;
    
    const blob = await audioPersistence.getAudioBlob(topic.id);
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${topic.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleDeleteAudio = async () => {
    if (!topic.audioFileUri) return;

    customAlert(
      'Delete Audio',
      'Are you sure you want to delete the generated audio for this topic?',
      async () => {
        try {
          if (currentTopicId === topic.id) {
            await stopSound();
          }

          await audioPersistence.deleteAudio(topic.id, topic.audioFileUri);

          const updatedTopic = { ...topic, audioFileUri: undefined };
          await saveTopic(updatedTopic);
          onUpdateTopic(updatedTopic);
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

  const isCurrentPlaying = currentTopicId === topic.id;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {topic.aiScript && (
        <View style={styles.section}>
          <Text style={styles.label}>AI Script</Text>
          <Text style={styles.notesText}>{topic.aiScript}</Text>
          
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
            <View style={{ flexDirection: 'row' }}>
              {Platform.OS === 'web' && (
                <TouchableOpacity onPress={handleDownload} style={[styles.deleteAudioButton, { marginRight: 10, backgroundColor: theme.colors.primary }]}>
                  <Text style={[styles.deleteAudioText, { color: '#fff' }]}>DOWNLOAD</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={handleDeleteAudio} style={styles.deleteAudioButton}>
                <Text style={styles.deleteAudioText}>DELETE</Text>
              </TouchableOpacity>
            </View>
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
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.xxl,
  },
  label: {
    ...theme.typography.label,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  notesText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  input: {
    ...theme.typography.body,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  audioSection: {
    marginTop: theme.spacing.lg,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.xxl,
  },
  audioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  audioTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },
  deleteAudioButton: {
    padding: theme.spacing.xs,
  },
  deleteAudioText: {
    ...theme.typography.label,
    fontSize: 10,
    color: theme.colors.error,
  },
  playerControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playIconButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.lg,
  },
  playIcon: {
    fontSize: 24,
    color: theme.colors.background,
    marginLeft: 4,
  },
  pauseIcon: {
    fontSize: 24,
    color: theme.colors.background,
  },
  progressContainer: {
    flex: 1,
  },
  timeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.xs,
  },
  timeText: {
    ...theme.typography.caption,
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  actions: {
    marginTop: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    ...theme.typography.label,
    color: theme.colors.background,
  },
  secondaryButton: {
    backgroundColor: theme.colors.background,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  secondaryButtonText: {
    ...theme.typography.label,
    color: theme.colors.text,
  },
});
