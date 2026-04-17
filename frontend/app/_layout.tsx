import { Stack } from 'expo-router';
import { AudioProvider } from '../src/context/AudioContext';
import { theme } from '../src/styles/theme';

export default function Layout() {
  return (
    <AudioProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerShadowVisible: false,
          headerTitleStyle: {
            ...theme.typography.h3,
            color: theme.colors.text,
          },
          headerTintColor: theme.colors.primary,
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Topics' }} />
        <Stack.Screen name="create" options={{ title: 'New' }} />
        <Stack.Screen name="[id]" options={{ title: '' }} />
        <Stack.Screen name="edit/[id]" options={{ title: 'Edit' }} />
      </Stack>
    </AudioProvider>
  );
}

