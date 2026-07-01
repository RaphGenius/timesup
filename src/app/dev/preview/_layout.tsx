import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useImmersiveMode } from '@/hooks/use-immersive-mode';

export default function DevPreviewLayout() {
  useImmersiveMode();

  return (
    <>
      <StatusBar hidden />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="[phase]" options={{ orientation: 'landscape' }} />
      </Stack>
    </>
  );
}
