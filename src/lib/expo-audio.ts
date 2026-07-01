type ExpoAudioModule = typeof import('expo-audio');

let expoAudioModule: ExpoAudioModule | null | undefined;

export function getExpoAudio(): ExpoAudioModule | null {
  if (expoAudioModule !== undefined) {
    return expoAudioModule ?? null;
  }

  try {
    expoAudioModule = require('expo-audio');
  } catch {
    expoAudioModule = null;
  }

  return expoAudioModule ?? null;
}

export function isExpoAudioAvailable(): boolean {
  return getExpoAudio() !== null;
}
