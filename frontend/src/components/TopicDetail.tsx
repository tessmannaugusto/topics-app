import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Platform, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { getTopicById, deleteTopic, Topic } from '../storage/topic-storage';
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
  const [activeTab, setActiveTab] = useState(0);
  
  const router = useRouter();

  const loadTopic = useCallback(async () => {
    if (id) {
      const data = await getTopicById(id);
      if (data) {
        setTopic(data);
      }
    }
  }, [id]);

  useEffect(() => {
    loadTopic();
  }, [id, loadTopic]);

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

  if (!topic) return (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>Select a topic to view details</Text>
    </View>
  );

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
        return <TopicInteractive />;
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
            <Text style={styles.date}>{new Date(topic.dateCreated).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
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
