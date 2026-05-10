import { Stack, useRouter } from 'expo-router';
import { AudioProvider } from '../src/context/AudioContext';
import { theme } from '../src/styles/theme';
import { TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Layout() {
  const router = useRouter();

  const ConfigButton = () => (
    <TouchableOpacity 
      onPress={() => router.push('/config')}
      style={{ marginRight: 15, padding: 5 }}
    >
      <MaterialCommunityIcons name="cog" size={24} color={theme.colors.primary} />
    </TouchableOpacity>
  );

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
          headerRight: () => <ConfigButton />,
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Topics' }} />
        <Stack.Screen name="create" options={{ title: 'New' }} />
        <Stack.Screen name="config" options={{ title: 'Settings' }} />
        <Stack.Screen name="[id]" options={{ title: '' }} />
        <Stack.Screen name="edit/[id]" options={{ title: 'Edit' }} />
        <Stack.Screen name="folder/[id]" options={{ title: 'Folder' }} />
      </Stack>
    </AudioProvider>
  );
}

