import React, { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { TopicDetail } from '../src/components/TopicDetail';
import { TopicList } from '../src/components/TopicList';
import { ResponsiveLayout, BREAKPOINT } from '../src/components/ResponsiveLayout';
import { useWindowDimensions } from 'react-native';

export default function TopicDetailScreen() {
  const { id } = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const router = useRouter();
  
  const [selectedId, setSelectedId] = useState<string | null>(typeof id === 'string' ? id : null);

  const isDesktop = width >= BREAKPOINT;

  const handleTopicSelect = (newId: string) => {
    if (isDesktop) {
      setSelectedId(newId);
      // Optional: Update URL without full navigation if possible, 
      // but Expo Router push/replace is safer.
      router.replace(`/${newId}`);
    } else {
      router.push(`/${newId}`);
    }
  };

  const currentId = typeof id === 'string' ? id : selectedId;

  return (
    <ResponsiveLayout
      sidebar={
        <TopicList 
          onTopicSelect={handleTopicSelect} 
          selectedTopicId={currentId || undefined} 
          isSidebar={true}
        />
      }
      content={
        currentId ? (
          <TopicDetail id={currentId} />
        ) : null
      }
    />
  );
}
