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
const CONFIG_KEY = '@user_config';

export interface ProviderConfig {
  apiKey?: string;
  model?: string;
}

export interface UserConfig {
  /** @deprecated Use providers.google.apiKey */
  geminiApiKey?: string;
  /** @deprecated Use providers.google.model */
  selectedModel?: string;

  providers: {
    google: ProviderConfig;
    openai: ProviderConfig;
    anthropic: ProviderConfig;
  };
  defaultProvider: 'google' | 'openai' | 'anthropic';
}

export const getUserConfig = async (): Promise<UserConfig> => {
  const data = await AsyncStorage.getItem(CONFIG_KEY);
  const config = data ? JSON.parse(data) : {};

  // Migration and initialization
  const updatedConfig: UserConfig = {
    providers: {
      google: {
        apiKey: config.providers?.google?.apiKey || config.geminiApiKey || '',
        model: config.providers?.google?.model || config.selectedModel || 'gemini-2.5-flash',
      },
      openai: {
        apiKey: config.providers?.openai?.apiKey || '',
        model: config.providers?.openai?.model || 'gpt-4o',
      },
      anthropic: {
        apiKey: config.providers?.anthropic?.apiKey || '',
        model: config.providers?.anthropic?.model || 'claude-3-5-sonnet-20240620',
      },
    },
    defaultProvider: config.defaultProvider || 'google',
  };

  return updatedConfig;
};

export const saveUserConfig = async (config: UserConfig): Promise<void> => {
  await AsyncStorage.setItem(CONFIG_KEY, JSON.stringify(config));
};

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
