import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Platform, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { getTopicById, deleteTopic, Topic, getFolders, Folder, saveTopic } from '../storage/topic-storage';
import { theme } from '../styles/theme';
import { TabBar } from './TabBar';
import { TopicNotes } from './TopicNotes';
import { TopicAudiobook } from './TopicAudiobook';
import { TopicInteractive } from './TopicInteractive';

interface TopicDetailProps {
  id: string;
  onDelete?: () => void;
}

// Helper for compatible alerts
const customAlert = (title: string, message: string, onConfirm?: () => void) => {
  if (Platform.OS === 'web') {
    if (onConfirm) {
      if (window.confirm(`${title}\n\n${message}`)) {
        onConfirm();
      }
    } else {
      window.alert(`${title}\n\n${message}`);
    }
  } else {
    if (onConfirm) onConfirm();
  }
};

export const TopicDetail: React.FC<TopicDetailProps> = ({ id, onDelete }) => {
  const [topic, setTopic] = useState<Topic | null>(null);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  
  const router = useRouter();

  const loadTopicAndFolders = useCallback(async () => {
    if (id) {
      const [topicData, foldersData] = await Promise.all([
        getTopicById(id),
        getFolders()
      ]);
      if (topicData) {
        setTopic(topicData);
      }
      setFolders(foldersData);
    }
  }, [id]);

  useEffect(() => {
    loadTopicAndFolders();
  }, [id, loadTopicAndFolders]);

  const handleDelete = async () => {
    customAlert(
      'Delete Topic',
      'Are you sure you want to delete this topic?',
      async () => {
        if (id) {
          await deleteTopic(id);
          if (onDelete) {
            onDelete();
          } else {
            router.back();
          }
        }
      }
    );
  };

  const handleMoveToFolder = () => {
    const move = async (folderId: string | null) => {
      if (topic) {
        const updatedTopic = { ...topic, folderId: folderId || undefined };
        await saveTopic(updatedTopic);
        setTopic(updatedTopic);
      }
    };

    if (Platform.OS === 'web') {
      const options = ['None (Uncategorized)', ...folders.map(f => f.name)];
      const choice = window.prompt(`Move to folder:\n0: None (Uncategorized)\n${folders.map((f, i) => `${i+1}: ${f.name}`).join('\n')}`);
      if (choice !== null) {
        const idx = parseInt(choice);
        if (idx === 0) move(null);
        else if (idx > 0 && idx <= folders.length) move(folders[idx-1].id);
      }
    } else {
      const options = [
        { text: 'Cancel', style: 'cancel' },
        { text: 'None (Uncategorized)', onPress: () => move(null) },
        ...folders.map(f => ({
          text: f.name,
          onPress: () => move(f.id)
        }))
      ];
      Alert.alert('Move to Folder', 'Select a folder:', options as any);
    }
  };

  if (!topic) return (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>Select a topic to view details</Text>
    </View>
  );

  const currentFolder = folders.find(f => f.id === topic.folderId);

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <TopicNotes 
            topic={topic} 
            onUpdateTopic={setTopic}
            customAlert={customAlert}
          />
        );
      case 1:
        return (
          <TopicAudiobook 
            topic={topic} 
            onUpdateTopic={setTopic}
            customAlert={customAlert}
          />
        );
      case 2:
        return (
          <TopicInteractive 
            topic={topic} 
            onUpdateTopic={setTopic}
            customAlert={customAlert}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.titleContainer}>
            <Text style={styles.name}>{topic.name}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.date}>{new Date(topic.dateCreated).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
              <TouchableOpacity onPress={handleMoveToFolder} style={styles.folderBadge}>
                <Text style={styles.folderBadgeText}>📁 {currentFolder?.name || 'Uncategorized'}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <Text style={styles.deleteButtonText}>DELETE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <TabBar 
        tabs={['Notes', 'Audiobook', 'Interactive']} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      <View style={styles.tabContent}>
        {renderTabContent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  loadingText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  header: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  name: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  date: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    flexWrap: 'wrap',
  },
  folderBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  folderBadgeText: {
    fontSize: 10,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  editButton: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
  },
  editButtonText: {
    ...theme.typography.label,
    color: theme.colors.primary,
    fontSize: 10,
  },
  deleteButton: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
  },
  deleteButtonText: {
    ...theme.typography.label,
    color: theme.colors.error,
    fontSize: 10,
  },
  tabContent: {
    flex: 1,
  },
});
