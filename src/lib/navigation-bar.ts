import { Platform } from 'react-native';

type NavigationBarModule = {
  setHidden: (hidden: boolean) => void;
};

let navigationBar: NavigationBarModule | null | undefined;

function getNavigationBar(): NavigationBarModule | null {
  if (Platform.OS !== 'android') {
    return null;
  }

  if (navigationBar !== undefined) {
    return navigationBar;
  }

  try {
    navigationBar = require('expo-navigation-bar').NavigationBar;
  } catch {
    navigationBar = null;
  }

  return navigationBar;
}

export function setNavigationBarHidden(hidden: boolean): void {
  try {
    getNavigationBar()?.setHidden(hidden);
  } catch {
    // Native module not available in the current dev client.
  }
}
