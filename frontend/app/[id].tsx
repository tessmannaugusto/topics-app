import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { TopicDetail } from '../src/components/TopicDetail';
import { TopicList } from '../src/components/TopicList';
import { ResponsiveLayout, BREAKPOINT } from '../src/components/ResponsiveLayout';
import { useWindowDimensions } from 'react-native';
import { getTopicById, Topic } from '../src/storage/topic-storage';

export default function TopicDetailScreen() {
  const { id } = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const router = useRouter();
  
  const [selectedId, setSelectedId] = useState<string | null>(typeof id === 'string' ? id : null);
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);

  const isDesktop = width >= BREAKPOINT;

  useEffect(() => {
    const loadTopic = async () => {
      const topicId = typeof id === 'string' ? id : selectedId;
      if (topicId) {
        const data = await getTopicById(topicId);
        if (data) {
          setCurrentTopic(data);
        }
      }
    };
    loadTopic();
  }, [id, selectedId]);

  const handleTopicSelect = (newId: string) => {
    if (isDesktop) {
      setSelectedId(newId);
      router.replace(`/${newId}`);
    } else {
      router.push(`/${newId}`);
    }
  };

  const currentId = typeof id === 'string' ? id : selectedId;

  // Sidebar is only shown if the topic belongs to a folder
  const sidebar = currentTopic?.folderId ? (
    <TopicList 
      onTopicSelect={handleTopicSelect} 
      selectedTopicId={currentId || undefined} 
      isSidebar={true}
      folderId={currentTopic.folderId}
      showFab={false}
    />
  ) : null;

  return (
    <ResponsiveLayout
      sidebar={sidebar}
      content={
        currentId ? (
          <TopicDetail id={currentId} />
        ) : null
      }
    />
  );
}
