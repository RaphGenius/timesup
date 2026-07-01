import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useImmersiveMode } from '@/hooks/use-immersive-mode';

export default function GameLayout() {
  useImmersiveMode();

  return (
    <>
      <StatusBar hidden />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ orientation: 'landscape' }} />
      </Stack>
    </>
  );
}
