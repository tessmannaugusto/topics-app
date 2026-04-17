import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { Alert, Platform } from 'react-native';

/**
 * Opens a document picker and reads the content of the selected .txt or .md file.
 * @returns The content of the file as a string, or null if cancelled/failed.
 */
export const pickAndReadNoteFile = async (): Promise<string | null> => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['text/plain', 'text/markdown'],
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return null;
    }

    const { uri, name } = result.assets[0];

    // Check extension manually for better safety
    const extension = name.split('.').pop()?.toLowerCase();
    if (extension !== 'txt' && extension !== 'md') {
      Alert.alert('Unsupported file', 'Please select a .txt or .md file.');
      return null;
    }

    // In Web, we might need a different approach if FileSystem is not available,
    // but the project uses expo-file-system which should work in most Expo environments
    // for local files picked this way.
    if (Platform.OS === 'web') {
      const response = await fetch(uri);
      const content = await response.text();
      return content;
    } else {
      const content = await FileSystem.readAsStringAsync(uri);
      return content;
    }
  } catch (error) {
    console.error('Error picking/reading file:', error);
    Alert.alert('Error', 'Failed to read the selected file.');
    return null;
  }
};
