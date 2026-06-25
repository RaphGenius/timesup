import { Stack } from 'expo-router';
import { NavigationBar } from 'expo-navigation-bar';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';

import { useImmersiveMode } from '@/hooks/use-immersive-mode';

export default function DevPreviewLayout() {
  useImmersiveMode();

  return (
    <>
      <StatusBar hidden />
      {Platform.OS === 'android' ? <NavigationBar hidden /> : null}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="[phase]" options={{ orientation: 'landscape' }} />
      </Stack>
    </>
  );
}
