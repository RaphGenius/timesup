import { useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { useCallback } from 'react';

import { setNavigationBarHidden } from '@/lib/navigation-bar';

export function useImmersiveMode() {
  useFocusEffect(
    useCallback(() => {
      StatusBar.setHidden(true, 'fade');

      if (Platform.OS === 'android') {
        setNavigationBarHidden(true);
      }

      return () => {
        StatusBar.setHidden(false, 'fade');

        if (Platform.OS === 'android') {
          setNavigationBarHidden(false);
        }
      };
    }, []),
  );
}
