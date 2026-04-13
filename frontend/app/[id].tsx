import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, Alert, ActivityIndicator, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { getTopicById, deleteTopic, saveTopic, Topic } from '../src/storage/topic-storage';
import { API_URL } from '../src/config';

export default function TopicDetail() {
  const { id } = useLocalSearchParams();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [instructions, setInstructions] = useState('');
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
      Alert.alert(
        'Regenerate Script',
        'A script already exists. Do you want to overwrite it?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Overwrite', onPress: () => performGeneration() },
        ]
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
        Alert.alert('Success', 'AI Script generated successfully!');
      } else {
        throw new Error(data.error || 'Failed to generate script');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete Topic',
      'Are you sure you want to delete this topic?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (typeof id === 'string') {
              await deleteTopic(id);
              router.back();
            }
          },
        },
      ]
    );
  };

  if (!topic) return null;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.name}>{topic.name}</Text>
      <Text style={styles.date}>Created: {new Date(topic.dateCreated).toLocaleString()}</Text>
      <Text style={styles.label}>Notes:</Text>
      <Text style={styles.notes}>{topic.notes || 'No notes provided.'}</Text>
      
      {topic.aiScript && (
        <>
          <Text style={styles.label}>AI Script:</Text>
          <Text style={styles.notes}>{topic.aiScript}</Text>
          
          <Text style={styles.label}>Regeneration Instructions (Optional):</Text>
          <TextInput
            style={styles.input}
            placeholder="Example: Make it 30% smaller, less fillers..."
            value={instructions}
            onChangeText={setInstructions}
            multiline
          />
        </>
      )}

      <View style={styles.actions}>
        {isGenerating ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Button 
            title={topic.aiScript ? "Regenerate AI Script" : "Generate AI Script"} 
            onPress={handleGenerateScript}
            disabled={!topic.notes || topic.notes.trim().length === 0}
          />
        )}
        <View style={styles.spacer} />
        <Button title="Edit Topic" onPress={() => router.push(`/edit/${topic.id}`)} />
        <View style={styles.spacer} />
        <Button title="Delete Topic" color="red" onPress={handleDelete} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  notes: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  actions: {
    marginTop: 32,
    marginBottom: 64,
  },
  spacer: {
    height: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
    backgroundColor: '#f9f9f9',
  },
});
