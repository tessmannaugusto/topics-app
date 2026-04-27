import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';
import * as Speech from 'expo-speech';
import { audioPersistence } from '../storage/audio-persistence';

interface AudioContextType {
  isPlaying: boolean;
  isSpeaking: boolean;
  currentTopicId: string | null;
  position: number;
  duration: number;
  playSound: (topicId: string, storedUri: string) => Promise<void>;
  pauseSound: () => Promise<void>;
  stopSound: () => Promise<void>;
  seekSound: (millis: number) => Promise<void>;
  speakLocal: (topicId: string, text: string) => Promise<void>;
  stopLocal: () => Promise<void>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentTopicId, setCurrentTopicId] = useState<string | null>(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    // Configure audio for background playback
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      interruptionModeIOS: 1, // InterruptionModeIOS.DoNotMix
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: 1, // InterruptionModeAndroid.DoNotMix
      playThroughEarpieceAndroid: false,
    });

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
      Speech.stop();
    };
  }, []);

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis || 0);
      setIsPlaying(status.isPlaying);
      if (status.didJustFinish) {
        setIsPlaying(false);
        setPosition(0);
        setCurrentTopicId(null);
      }
    }
  };

  const playSound = async (topicId: string, storedUri: string) => {
    try {
      if (isSpeaking) {
        await stopLocal();
      }

      // If the same audio is paused, resume it
      if (currentTopicId === topicId && sound) {
        await sound.playAsync();
        return;
      }

      // If a different audio is playing, stop and unload it
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }

      // Resolve the actual playable URI
      const playableUri = await audioPersistence.getAudioUri(topicId, storedUri);
      if (!playableUri) {
        console.error('Audio file not found');
        return;
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: playableUri },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );

      setSound(newSound);
      setCurrentTopicId(topicId);
    } catch (error) {
      console.error('Error in playSound:', error);
    }
  };

  const pauseSound = async () => {
    if (sound) {
      await sound.pauseAsync();
    }
  };

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setCurrentTopicId(null);
      setIsPlaying(false);
      setPosition(0);
    }
  };

  const seekSound = async (millis: number) => {
    if (sound) {
      await sound.setPositionAsync(millis);
      setPosition(millis);
    }
  };

  const speakLocal = async (topicId: string, text: string) => {
    try {
      if (sound) {
        await stopSound();
      }
      
      if (isSpeaking) {
        await stopLocal();
      }

      setCurrentTopicId(topicId);
      setIsSpeaking(true);
      
      Speech.speak(text, {
        language: 'en',
        onDone: () => {
          setIsSpeaking(false);
          setCurrentTopicId(null);
        },
        onError: (error) => {
          console.error('Speech error:', error);
          setIsSpeaking(false);
          setCurrentTopicId(null);
        }
      });
    } catch (error) {
      console.error('Error in speakLocal:', error);
    }
  };

  const stopLocal = async () => {
    await Speech.stop();
    setIsSpeaking(false);
    setCurrentTopicId(null);
  };

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        isSpeaking,
        currentTopicId,
        position,
        duration,
        playSound,
        pauseSound,
        stopSound,
        seekSound,
        speakLocal,
        stopLocal,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
