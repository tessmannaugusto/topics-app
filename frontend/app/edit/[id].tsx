import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
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
          setName(data.name);
          setNotes(data.notes);
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
      <Button title="Update Topic" onPress={handleSave} />
    </View>
  );
}
