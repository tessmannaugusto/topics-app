import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { theme } from '../styles/theme';
import { Topic, saveTopic } from '../storage/topic-storage';
import { pickAndReadNoteFile } from '../storage/file-import';
import { startRecording, stopRecording, isWebSpeechSupported } from '../storage/voice-recorder';

interface TopicNotesProps {
  topic: Topic;
  onUpdateTopic: (updatedTopic: Topic) => void;
  customAlert: (title: string, message: string, onConfirm?: () => void) => void;
}

export const TopicNotes: React.FC<TopicNotesProps> = ({ topic, onUpdateTopic, customAlert }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localNotes, setLocalNotes] = useState(topic.notes || '');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');

  useEffect(() => {
    setLocalNotes(topic.notes || '');
  }, [topic.notes]);

  const handleImport = async () => {
    const content = await pickAndReadNoteFile();
    if (content) {
      setLocalNotes((prev) => (prev ? `${prev}\n\n${content}` : content));
    }
  };

  const handleVoiceToggle = async () => {
    if (isRecording) {
      setIsRecording(false);
      const result = await stopRecording();
      setInterimTranscript('');
      if (result?.transcript) {
        setLocalNotes((prev) => (prev ? `${prev}\n\n${result.transcript}` : result.transcript || ''));
      }
    } else {
      const started = await startRecording((text) => setInterimTranscript(text));
      if (started) {
        setIsRecording(true);
      } else {
        customAlert('Error', 'Microphone access denied or not supported.');
      }
    }
  };

  const handleSave = async () => {
    const updatedTopic = { ...topic, notes: localNotes };
    await saveTopic(updatedTopic);
    onUpdateTopic(updatedTopic);
    setIsEditing(false);
    setSaveStatus('Notes updated!');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Notes</Text>
      
      {isEditing ? (
        <View>
          <TextInput
            style={styles.input}
            value={isRecording ? localNotes + (interimTranscript ? `\n\n[Recording...]\n${interimTranscript}` : '\n\n[Recording...]') : localNotes}
            onChangeText={setLocalNotes}
            placeholder="Edit your notes here..."
            multiline
            editable={!isRecording}
          />
          <View style={styles.toolbar}>
            <TouchableOpacity style={styles.toolButton} onPress={handleImport}>
              <Text style={styles.toolButtonText}>IMPORT</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.toolButton, isRecording && styles.recordingButton]} 
              onPress={handleVoiceToggle}
            >
              <Text style={styles.toolButtonText}>{isRecording ? 'STOP MIC' : 'MIC'}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>UPDATE NOTES</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity onPress={() => setIsEditing(true)} activeOpacity={0.7} style={styles.notesContainer}>
          <Text style={styles.notesText}>{topic.notes || 'No notes provided. Tap to edit.'}</Text>
        </TouchableOpacity>
      )}
      
      {saveStatus && <Text style={styles.statusText}>{saveStatus}</Text>}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: theme.spacing.lg },
  label: { ...theme.typography.label, color: theme.colors.textSecondary, marginBottom: theme.spacing.md },
  notesContainer: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minHeight: 100,
  },
  notesText: { ...theme.typography.body, color: theme.colors.text },
  statusText: { ...theme.typography.caption, color: theme.colors.success, marginTop: theme.spacing.md, textAlign: 'center' },
  input: {
    ...theme.typography.body,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    minHeight: 200,
    textAlignVertical: 'top',
  },
  toolbar: { flexDirection: 'row', gap: theme.spacing.sm, marginTop: theme.spacing.md },
  toolButton: { padding: theme.spacing.sm, backgroundColor: theme.colors.border, borderRadius: theme.borderRadius.sm },
  toolButtonText: { ...theme.typography.label, fontSize: 10 },
  recordingButton: { backgroundColor: theme.colors.error },
  saveButton: { marginTop: theme.spacing.md, padding: theme.spacing.md, backgroundColor: theme.colors.primary, borderRadius: theme.borderRadius.round, alignItems: 'center' },
  saveButtonText: { ...theme.typography.label, color: theme.colors.background },
});
