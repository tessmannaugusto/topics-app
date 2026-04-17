import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

const HIGH_ACCURACY_STT_OPTIONS = {
  android: {
    extension: '.amr',
    outputFormat: Audio.AndroidOutputFormat.AMR_WB,
    audioEncoder: Audio.AndroidAudioEncoder.AMR_WB,
    sampleRate: 16000,
    numberOfChannels: 1,
    bitRate: 23850,
  },
  ios: {
    extension: '.wav',
    outputFormat: Audio.IOSOutputFormat.LINEARPCM,
    audioQuality: Audio.IOSAudioQuality.MAX,
    sampleRate: 16000,
    numberOfChannels: 1,
    bitDepth: 16,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
  web: {
    // Web defaults
  }
};

let recording: Audio.Recording | null = null;

export const startRecording = async (): Promise<boolean> => {
  try {
    const permission = await Audio.requestPermissionsAsync();
    if (permission.status !== 'granted') return false;

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const recordingOptions = Platform.select({
      android: HIGH_ACCURACY_STT_OPTIONS.android,
      ios: HIGH_ACCURACY_STT_OPTIONS.ios,
      default: Audio.RecordingOptionsPresets.HIGH_QUALITY,
    });

    const { recording: newRecording } = await Audio.Recording.createAsync(recordingOptions as any);
    recording = newRecording;
    return true;
  } catch (err) {
    console.error('Failed to start recording', err);
    return false;
  }
};

export const stopRecording = async (): Promise<string | null> => {
  if (!recording) return null;

  try {
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    recording = null;

    if (!uri) return null;

    // Read as base64
    const base64Content = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    return base64Content;
  } catch (err) {
    console.error('Failed to stop recording', err);
    return null;
  }
};
