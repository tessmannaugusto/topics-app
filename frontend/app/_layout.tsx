import { Stack } from 'expo-router';
import { AudioProvider } from '../src/context/AudioContext';

export default function Layout() {
  return (
    <AudioProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Topics' }} />
        <Stack.Screen name="create" options={{ title: 'Create Topic' }} />
        <Stack.Screen name="[id]" options={{ title: 'Topic Detail' }} />
        <Stack.Screen name="edit/[id]" options={{ title: 'Edit Topic' }} />
      </Stack>
    </AudioProvider>
  );
}

