import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { saveTopic } from '../src/storage/topic-storage';
import { pickAndReadNoteFile } from '../src/storage/file-import';
import { startRecording, stopRecording } from '../src/storage/voice-recorder';
import { API_URL } from '../src/config';
import { formStyles as styles } from '../src/styles/form.styles';

export default function CreateTopic() {
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    if (!name.trim()) return;
    
    const newTopic = {
      id: Date.now().toString(),
      name,
      notes,
      dateCreated: new Date().toISOString(),
    };
    
    await saveTopic(newTopic);
    router.back();
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
      const audioBase64 = await stopRecording();
      if (audioBase64) {
        try {
          const response = await fetch(`${API_URL}/transcribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              audioContent: audioBase64,
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
    } else {
      const started = await startRecording();
      if (started) {
        setIsRecording(true);
      } else {
        Alert.alert('Permission denied', 'Please allow microphone access to use voice-to-note.');
      }
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>What's on your mind?</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Topic Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Quantum Physics"
            placeholderTextColor="#CCC"
            autoFocus
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
            value={notes}
            onChangeText={setNotes}
            placeholder="Paste your notes or ideas here..."
            placeholderTextColor="#CCC"
            multiline
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.submitButton} 
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>CREATE TOPIC</Text>
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
