import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Platform } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { TopicList } from '../../src/components/TopicList';
import { getFolderById, saveFolder, deleteFolder, Folder } from '../../src/storage/topic-storage';
import { theme } from '../../src/styles/theme';

export default function FolderDetailScreen() {
  const { id } = useLocalSearchParams();
  const folderId = typeof id === 'string' ? id : '';
  const [folder, setFolder] = useState<Folder | null>(null);
  const router = useRouter();

  const loadFolder = useCallback(async () => {
    if (folderId) {
      const data = await getFolderById(folderId);
      if (data) {
        setFolder(data);
      } else {
        router.replace('/');
      }
    }
  }, [folderId, router]);

  useEffect(() => {
    loadFolder();
  }, [loadFolder]);

  const handleEditFolder = () => {
    if (Platform.OS === 'web') {
      const newName = window.prompt('Enter new folder name:', folder?.name);
      if (newName && newName.trim() !== folder?.name) {
        updateFolderName(newName.trim());
      }
    } else {
      Alert.prompt(
        'Edit Folder',
        'Enter new folder name:',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Save', 
            onPress: (newName?: string) => {
              if (newName && newName.trim()) {
                updateFolderName(newName.trim());
              }
            } 
          },
        ],
        'plain-text',
        folder?.name
      );
    }
  };

  const updateFolderName = async (newName: string) => {
    if (folder) {
      const updatedFolder = { ...folder, name: newName };
      await saveFolder(updatedFolder);
      setFolder(updatedFolder);
    }
  };

  const handleDeleteFolder = () => {
    const performDelete = async () => {
      await deleteFolder(folderId);
      router.replace('/');
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to delete this folder? Topics will not be deleted.')) {
        performDelete();
      }
    } else {
      Alert.alert(
        'Delete Folder',
        'Are you sure you want to delete this folder? Topics will not be deleted.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: performDelete },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: folder?.name || 'Folder',
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity onPress={handleEditFolder} style={styles.headerButton}>
                <Text style={styles.headerButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeleteFolder} style={styles.headerButton}>
                <Text style={[styles.headerButtonText, { color: theme.colors.error || '#ff4444' }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          )
        }} 
      />
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Topics</Text>
        <TouchableOpacity 
          onPress={() => router.push(`/create?folderId=${folderId}`)} 
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>+ Topic</Text>
        </TouchableOpacity>
      </View>
      <TopicList folderId={folderId} showFab={false} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerButtons: {
    flexDirection: 'row',
    paddingRight: 10,
  },
  headerButton: {
    marginLeft: 15,
  },
  headerButtonText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 5,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  addButton: {
    padding: 5,
  },
  addButtonText: {
    color: theme.colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
});
