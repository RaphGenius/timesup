import { useFocusEffect } from 'expo-router';
import { NavigationBar } from 'expo-navigation-bar';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { useCallback } from 'react';

export function useImmersiveMode() {
  useFocusEffect(
    useCallback(() => {
      StatusBar.setHidden(true, 'fade');

      if (Platform.OS === 'android') {
        NavigationBar.setHidden(true);
      }

      return () => {
        StatusBar.setHidden(false, 'fade');

        if (Platform.OS === 'android') {
          NavigationBar.setHidden(false);
        }
      };
    }, []),
  );
}
