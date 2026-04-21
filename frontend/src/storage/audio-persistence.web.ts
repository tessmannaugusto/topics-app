import { get, set, del } from 'idb-keyval';
import { AudioPersistence } from './audio-persistence';

const STORAGE_PREFIX = 'audio_';

const webPersistence: AudioPersistence = {
  async saveAudio(topicId: string, blob: Blob): Promise<string> {
    const key = `${STORAGE_PREFIX}${topicId}`;
    await set(key, blob);
    // On web, we return a virtual URI marker. 
    // The actual URL.createObjectURL happens in getAudioUri to ensure it's fresh.
    return `idb://${topicId}`;
  },

  async getAudioUri(topicId: string, storedUri?: string): Promise<string | null> {
    const blob = await this.getAudioBlob(topicId);
    if (!blob) return null;
    return URL.createObjectURL(blob);
  },

  async getAudioBlob(topicId: string): Promise<Blob | null> {
    const key = `${STORAGE_PREFIX}${topicId}`;
    return await get<Blob>(key) || null;
  },

  async deleteAudio(topicId: string, storedUri?: string): Promise<void> {
    const key = `${STORAGE_PREFIX}${topicId}`;
    await del(key);
  }
};

export default webPersistence;
