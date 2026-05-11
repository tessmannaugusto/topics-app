// We export the interface
export interface AudioPersistence {
  saveAudio(topicId: string, blob: Blob): Promise<string>;
  getAudioUri(topicId: string, storedUri?: string): Promise<string | null>;
  getAudioBlob(topicId: string): Promise<Blob | null>;
  deleteAudio(topicId: string, storedUri?: string): Promise<void>;
}
