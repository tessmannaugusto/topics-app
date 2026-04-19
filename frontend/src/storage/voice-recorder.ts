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
};

let recording: Audio.Recording | null = null;
let recognition: any = null;
let webTranscript: string = '';

export const isWebSpeechSupported = (): boolean => {
  if (Platform.OS !== 'web') return false;
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  return !!SpeechRecognition;
};

export const startRecording = async (onTranscript?: (text: string) => void): Promise<boolean> => {
  if (isWebSpeechSupported()) {
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      webTranscript = '';
      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        // Combine for display, but we'll probably only care about final in the end
        // Or we can just join all currently available results
        const currentTotal = Array.from(event.results)
          .map((res: any) => (res as any)[0].transcript)
          .join(' ');
        
        webTranscript = currentTotal;
        if (onTranscript) {
          onTranscript(currentTotal);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Web Speech Error', event.error);
      };

      recognition.start();
      return true;
    } catch (err) {
      console.error('Failed to start Web Speech', err);
      return false;
    }
  }

  // Fallback to native recording
  try {
    const permission = await Audio.requestPermissionsAsync();
    if (permission.status !== 'granted') return false;

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const recordingOptions = Platform.select<any>({
      android: HIGH_ACCURACY_STT_OPTIONS.android,
      ios: HIGH_ACCURACY_STT_OPTIONS.ios,
      default: Audio.RecordingOptionsPresets.HIGH_QUALITY,
    });

    const { recording: newRecording } = await Audio.Recording.createAsync(recordingOptions);
    recording = newRecording;
    return true;
  } catch (err) {
    console.error('Failed to start recording', err);
    return false;
  }
};

export interface StopResult {
  audioBase64?: string;
  transcript?: string;
}

export const stopRecording = async (): Promise<StopResult | null> => {
  if (recognition) {
    recognition.stop();
    const result = { transcript: webTranscript };
    recognition = null;
    return result;
  }

  if (!recording) return null;

  try {
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    recording = null;

    if (!uri) return null;

    // Read as base64
    const base64Content = await FileSystem.readAsStringAsync(uri, {
      encoding: 'base64',
    });

    return { audioBase64: base64Content };
  } catch (err) {
    console.error('Failed to stop recording', err);
    return null;
  }
};
