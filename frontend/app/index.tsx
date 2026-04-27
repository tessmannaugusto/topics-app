import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { TopicList } from '../src/components/TopicList';
import { FolderList } from '../src/components/FolderList';
import { saveFolder } from '../src/storage/topic-storage';
import { theme } from '../src/styles/theme';

export default function TopicListScreen() {
  const router = useRouter();
  const [refreshSeed, setRefreshSeed] = useState(0);

  const triggerRefresh = () => setRefreshSeed(s => s + 1);

  const handleCreateFolder = () => {
    const create = async (name: string) => {
      const newFolder = {
        id: Math.random().toString(36).substring(7),
        name: name.trim(),
        dateCreated: new Date().toISOString(),
      };
      await saveFolder(newFolder);
      triggerRefresh();
    };

    if (Platform.OS === 'web') {
      const name = window.prompt('Enter folder name:');
      if (name && name.trim()) {
        create(name);
      }
    } else {
      Alert.prompt(
        'New Folder',
        'Enter folder name:',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Create', 
            onPress: (name?: string) => {
              if (name && name.trim()) {
                create(name);
              }
            } 
          },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerRight: () => (
            <TouchableOpacity onPress={handleCreateFolder} style={styles.headerButton}>
              <Text style={styles.headerButtonText}>+ Folder</Text>
            </TouchableOpacity>
          )
        }} 
      />
      <FolderList refreshTrigger={refreshSeed} />
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>All Topics</Text>
      </View>
      <TopicList folderId={null} refreshTrigger={refreshSeed} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerButton: {
    marginRight: 15,
  },
  headerButtonText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  listHeader: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 5,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
});
