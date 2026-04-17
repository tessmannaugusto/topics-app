import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { saveTopic } from '../src/storage/topic-storage';
import { formStyles as styles } from '../src/styles/form.styles';

export default function CreateTopic() {
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
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
          <Text style={styles.label}>Notes</Text>
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
