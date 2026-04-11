import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { saveTopic, Topic } from '../src/storage/topic-storage';

export default function CreateTopic() {
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const router = useRouter();

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Topic Name is required.');
      return;
    }

    const newTopic: Topic = {
      id: Date.now().toString(),
      name,
      notes,
      dateCreated: new Date().toISOString(),
    };

    await saveTopic(newTopic);
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Topic Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="e.g. Photosynthesis"
      />
      <Text style={styles.label}>Notes</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={notes}
        onChangeText={setNotes}
        placeholder="Enter your notes here..."
        multiline
      />
      <Button title="Save Topic" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 150,
    textAlignVertical: 'top',
  },
});
