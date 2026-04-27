import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { saveTopic, getFolders, Folder } from '../src/storage/topic-storage';
import { pickAndReadNoteFile } from '../src/storage/file-import';
import { startRecording, stopRecording } from '../src/storage/voice-recorder';
import { API_URL } from '../src/config';
import { formStyles as styles } from '../src/styles/form.styles';
import { theme } from '../src/styles/theme';

export default function CreateTopic() {
  const { folderId: initialFolderId } = useLocalSearchParams();
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(
    typeof initialFolderId === 'string' ? initialFolderId : null
  );
  const [showFolderPicker, setShowFolderPicker] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    const loadFolders = async () => {
      const data = await getFolders();
      setFolders(data);
    };
    loadFolders();
  }, []);

  const handleSave = async () => {
    if (!name.trim()) return;
    
    const newTopic = {
      id: Date.now().toString(),
      name,
      notes,
      dateCreated: new Date().toISOString(),
      folderId: selectedFolderId || undefined,
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
          <Text style={styles.label}>Folder</Text>
          <TouchableOpacity 
            style={localStyles.folderPickerButton}
            onPress={() => setShowFolderPicker(!showFolderPicker)}
          >
            <Text style={localStyles.folderPickerButtonText}>
              {selectedFolderId 
                ? folders.find(f => f.id === selectedFolderId)?.name || 'Select Folder' 
                : 'None (Uncategorized)'}
            </Text>
            <Text style={localStyles.folderPickerArrow}>{showFolderPicker ? '▲' : '▼'}</Text>
          </TouchableOpacity>
          
          {showFolderPicker && (
            <View style={localStyles.folderPickerList}>
              <TouchableOpacity 
                style={localStyles.folderOption}
                onPress={() => {
                  setSelectedFolderId(null);
                  setShowFolderPicker(false);
                }}
              >
                <Text style={[localStyles.folderOptionText, !selectedFolderId && localStyles.selectedOption]}>None (Uncategorized)</Text>
              </TouchableOpacity>
              {folders.map(folder => (
                <TouchableOpacity 
                  key={folder.id}
                  style={localStyles.folderOption}
                  onPress={() => {
                    setSelectedFolderId(folder.id);
                    setShowFolderPicker(false);
                  }}
                >
                  <Text style={[localStyles.folderOptionText, selectedFolderId === folder.id && localStyles.selectedOption]}>
                    {folder.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
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
const localStyles = StyleSheet.create({
  folderPickerButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EEE',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  folderPickerButtonText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  folderPickerArrow: {
    fontSize: 12,
    color: '#999',
  },
  folderPickerList: {
    marginTop: 5,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EEE',
    borderRadius: 8,
    maxHeight: 200,
    overflow: 'hidden',
  },
  folderOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  folderOptionText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  selectedOption: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
});
