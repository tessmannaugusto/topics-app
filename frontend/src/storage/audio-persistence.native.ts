import * as FileSystem from 'expo-file-system/legacy';
import { AudioPersistence } from './audio-persistence';

const nativePersistence: AudioPersistence = {
  async saveAudio(topicId: string, blob: Blob): Promise<string> {
    const fileUri = `${FileSystem.documentDirectory}${topicId}.mp3`;
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64data = (reader.result as string).split(',')[1];
          await FileSystem.writeAsStringAsync(fileUri, base64data, {
            encoding: FileSystem.EncodingType.Base64,
          });
          resolve(fileUri);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read blob'));
      reader.readAsDataURL(blob);
    });
  },

  async getAudioUri(topicId: string, storedUri?: string): Promise<string | null> {
    if (!storedUri) return null;
    const info = await FileSystem.getInfoAsync(storedUri);
    return info.exists ? storedUri : null;
  },

  async getAudioBlob(topicId: string): Promise<Blob | null> {
    // Mobile doesn't strictly need this for now, but we'll return null for interface compliance.
    return null;
  },

  async deleteAudio(topicId: string, storedUri?: string): Promise<void> {
    if (!storedUri) return;
    const info = await FileSystem.getInfoAsync(storedUri);
    if (info.exists) {
      await FileSystem.deleteAsync(storedUri);
    }
  }
};

export default nativePersistence;
