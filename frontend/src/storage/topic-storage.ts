import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Question {
  id: string;
  text: string;
  answer?: string;
  evaluation?: Evaluation;
}

export interface Evaluation {
  status: 'correct' | 'partial' | 'incorrect' | 'pending';
  feedback: string;
}

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
  questions?: Question[];
  folderId?: string;
}

export interface Folder {
  id: string;
  name: string;
  dateCreated: string;
}

const STORAGE_KEY = '@topics';
const FOLDERS_KEY = '@folders';

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

export const getFolders = async (): Promise<Folder[]> => {
  const data = await AsyncStorage.getItem(FOLDERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const getFolderById = async (id: string): Promise<Folder | undefined> => {
  const folders = await getFolders();
  return folders.find((f) => f.id === id);
};

export const saveFolder = async (folder: Folder): Promise<void> => {
  const folders = await getFolders();
  const existingIndex = folders.findIndex((f) => f.id === folder.id);
  if (existingIndex > -1) {
    folders[existingIndex] = folder;
  } else {
    folders.push(folder);
  }
  await AsyncStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
};

export const deleteFolder = async (id: string): Promise<void> => {
  // Delete folder
  const folders = await getFolders();
  const filteredFolders = folders.filter((f) => f.id !== id);
  await AsyncStorage.setItem(FOLDERS_KEY, JSON.stringify(filteredFolders));

  // Unset folderId in topics
  const topics = await getTopics();
  const updatedTopics = topics.map(topic => {
    if (topic.folderId === id) {
      const { folderId, ...rest } = topic;
      return rest;
    }
    return topic;
  });
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTopics));
};
