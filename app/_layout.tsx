import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Topics' }} />
      <Stack.Screen name="create" options={{ title: 'New Topic' }} />
      <Stack.Screen name="edit/[id]" options={{ title: 'Edit Topic' }} />
      <Stack.Screen name="[id]" options={{ title: 'Topic Details' }} />
    </Stack>
  );
}
