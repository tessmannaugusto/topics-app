import { Platform } from 'react-native';

// We export the interface
export interface AudioPersistence {
  saveAudio(topicId: string, blob: Blob): Promise<string>;
  getAudioUri(topicId: string, storedUri?: string): Promise<string | null>;
  getAudioBlob(topicId: string): Promise<Blob | null>;
  deleteAudio(topicId: string, storedUri?: string): Promise<void>;
}

/**
 * Platform-agnostic audio persistence layer.
 * Metro/Webpack will resolve this to either:
 * - audio-persistence.native.ts
 * - audio-persistence.web.ts
 */
// @ts-ignore - Platform-specific resolution
import persistence from './audio-persistence.native';
export const audioPersistence: AudioPersistence = persistence;
