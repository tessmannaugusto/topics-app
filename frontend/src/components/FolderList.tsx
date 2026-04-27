import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { getFolders, Folder } from '../storage/topic-storage';
import { theme } from '../styles/theme';

export const FolderList: React.FC<{ refreshTrigger?: number, onCreateFolder?: () => void }> = ({ refreshTrigger, onCreateFolder }) => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const router = useRouter();

  const loadFolders = useCallback(async () => {
    const data = await getFolders();
    setFolders(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFolders();
    }, [loadFolders])
  );

  useEffect(() => {
    loadFolders();
  }, [loadFolders, refreshTrigger]);

  const renderItem = ({ item }: { item: Folder }) => (
    <TouchableOpacity
      style={styles.folderItem}
      onPress={() => router.push(`/folder/${item.id}`)}
    >
      <View style={styles.folderIconContainer}>
        <Text style={styles.folderIcon}>📁</Text>
      </View>
      <Text style={styles.folderName} numberOfLines={1}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Folders</Text>
        {onCreateFolder && (
          <TouchableOpacity onPress={onCreateFolder} style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Folder</Text>
          </TouchableOpacity>
        )}
      </View>
      {folders.length > 0 ? (
        <FlatList
          data={folders}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No folders yet</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  title: {
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
  listContent: {
    paddingHorizontal: 15,
  },
  emptyContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  folderItem: {
    width: 100,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  folderIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  folderIcon: {
    fontSize: 30,
  },
  folderName: {
    fontSize: 14,
    textAlign: 'center',
    color: theme.colors.text,
  },
});
