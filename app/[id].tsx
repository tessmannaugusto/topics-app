import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { getTopicById, deleteTopic, Topic } from '../src/storage/topic-storage';

export default function TopicDetail() {
  const { id } = useLocalSearchParams();
  const [topic, setTopic] = useState<Topic | null>(null);
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
        </>
      )}

      <View style={styles.actions}>
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
    marginBottom: 32,
  },
  spacer: {
    height: 12,
  },
});
