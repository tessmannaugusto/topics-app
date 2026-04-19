import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getTopicById, saveTopic, Topic } from '../../src/storage/topic-storage';
import { pickAndReadNoteFile } from '../../src/storage/file-import';
import { startRecording, stopRecording } from '../../src/storage/voice-recorder';
import { API_URL } from '../../src/config';
import { formStyles as styles } from '../../src/styles/form.styles';

export default function EditTopic() {
  const { id } = useLocalSearchParams();
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [topic, setTopic] = useState<Topic | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const router = useRouter();

  useEffect(() => {
    const loadTopic = async () => {
      if (typeof id === 'string') {
        const data = await getTopicById(id);
        if (data) {
          setTopic(data);
          setName(data.name || '');
          setNotes(data.notes || '');
        }
      }
    };
    loadTopic();
  }, [id]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Topic Name is required.');
      return;
    }

    if (topic) {
      const updatedTopic: Topic = {
        ...topic,
        name,
        notes,
      };
      await saveTopic(updatedTopic);
      router.back();
    }
  };

  const handleImport = async () => {
    const content = await pickAndReadNoteFile();
    if (content) {
      setNotes(content);
    }
  };

  const handleVoiceToggle = async () => {
    if (isRecording) {
      setIsRecording(false);
      const result = await stopRecording();
      setInterimTranscript('');
      if (result) {
        if (result.transcript) {
          setNotes((prev) => (prev ? `${prev}\n\n${result.transcript}` : result.transcript || ''));
        } else if (result.audioBase64) {
          try {
            const response = await fetch(`${API_URL}/transcribe`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                audioContent: result.audioBase64,
                platform: Platform.OS,
              }),
            });
            const data = await response.json();
            if (data.transcript) {
              setNotes((prev) => (prev ? `${prev}\n\n${data.transcript}` : data.transcript));
            }
          } catch (error) {
            console.error('Transcription error:', error);
            Alert.alert('Error', 'Failed to transcribe audio.');
          }
        }
      }
    } else {
      const started = await startRecording((text) => {
        setInterimTranscript(text);
      });
      if (started) {
        setIsRecording(true);
      } else {
        Alert.alert('Permission denied', 'Please allow microphone access to use voice-to-note.');
      }
    }
  };

  if (!topic) return null;

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Refine your thoughts</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Topic Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Quantum Physics"
            placeholderTextColor="#CCC"
          />
        </View>

        <View style={styles.field}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Notes</Text>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity 
                style={styles.importButton} 
                onPress={handleImport}
                activeOpacity={0.7}
              >
                <Text style={styles.importButtonText}>IMPORT .TXT/.MD</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.micButton, isRecording && styles.micButtonRecording]} 
                onPress={handleVoiceToggle}
                activeOpacity={0.7}
              >
                <Text style={[styles.micButtonText, isRecording && styles.micButtonTextRecording]}>
                  {isRecording ? 'STOP' : 'MIC'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <TextInput
            style={styles.textArea}
            value={isRecording ? notes + (interimTranscript ? `\n\n[Recording...]\n${interimTranscript}` : '\n\n[Recording...]') : notes}
            onChangeText={setNotes}
            placeholder="Paste your notes or ideas here..."
            placeholderTextColor="#CCC"
            multiline
            editable={!isRecording}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.submitButton} 
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>UPDATE TOPIC</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>CANCEL</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
