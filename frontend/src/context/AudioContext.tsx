import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { Platform } from 'react-native';

interface AudioContextType {
  isPlaying: boolean;
  currentTopicId: string | null;
  position: number;
  duration: number;
  playSound: (topicId: string, uri: string) => Promise<void>;
  pauseSound: () => Promise<void>;
  stopSound: () => Promise<void>;
  seekSound: (millis: number) => Promise<void>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
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

  const playSound = async (topicId: string, uri: string) => {
    try {
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

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true, staysActiveInBackground: true },
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

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        currentTopicId,
        position,
        duration,
        playSound,
        pauseSound,
        stopSound,
        seekSound,
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
