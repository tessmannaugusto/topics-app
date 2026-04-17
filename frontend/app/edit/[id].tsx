import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getTopicById, saveTopic, Topic } from '../../src/storage/topic-storage';
import { formStyles as styles } from '../../src/styles/form.styles';

export default function EditTopic() {
  const { id } = useLocalSearchParams();
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [topic, setTopic] = useState<Topic | null>(null);
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
