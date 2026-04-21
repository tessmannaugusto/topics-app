import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Topic {
  id: string;
  name: string;
  notes: string;
  dateCreated: string;
  aiScript?: string;
  /**
   * Platform-specific audio reference:
   * - Mobile: file://... (native file system path)
   * - Web: idb://... (IndexedDB marker)
   */
  audioFileUri?: string;
}

const STORAGE_KEY = '@topics';

export const saveTopic = async (topic: Topic): Promise<void> => {
  const topics = await getTopics();
  const existingIndex = topics.findIndex((t) => t.id === topic.id);
  if (existingIndex > -1) {
    topics[existingIndex] = topic;
  } else {
    topics.push(topic);
  }
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(topics));
};

export const getTopics = async (): Promise<Topic[]> => {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const deleteTopic = async (id: string): Promise<void> => {
  const topics = await getTopics();
  const filtered = topics.filter((t) => t.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const getTopicById = async (id: string): Promise<Topic | undefined> => {
  const topics = await getTopics();
  return topics.find((t) => t.id === id);
};
