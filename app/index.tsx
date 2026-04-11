import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { getTopics, Topic } from '../src/storage/topic-storage';

export default function TopicList() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const router = useRouter();

  const loadTopics = async () => {
    const data = await getTopics();
    setTopics(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadTopics();
    }, [])
  );

  const renderItem = ({ item }: { item: Topic }) => (
    <TouchableOpacity
      style={styles.topicItem}
      onPress={() => router.push(`/${item.id}`)}
    >
      <Text style={styles.topicName}>{item.name}</Text>
      <Text style={styles.topicDate}>{new Date(item.dateCreated).toLocaleDateString()}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={topics}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>No topics yet.</Text>}
      />
      <View style={styles.buttonContainer}>
        <Button title="Create Topic" onPress={() => router.push('/create')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  topicItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  topicName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  topicDate: {
    fontSize: 12,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  buttonContainer: {
    marginTop: 16,
  },
});
