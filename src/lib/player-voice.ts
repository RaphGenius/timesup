import {
  deleteAsync,
  documentDirectory,
  makeDirectoryAsync,
  moveAsync,
} from 'expo-file-system/legacy';
function getVoiceDirectoryUri(): string {
  if (!documentDirectory) {
    throw new Error('Document directory is not available.');
  }

  return `${documentDirectory}player-voices/`;
}

export function getPlayerVoiceUri(playerId: string): string {
  return `${getVoiceDirectoryUri()}${playerId}.m4a`;
}

export async function persistPlayerVoice(playerId: string, tempUri: string): Promise<string> {
  const voiceDirectoryUri = getVoiceDirectoryUri();
  await makeDirectoryAsync(voiceDirectoryUri, { intermediates: true });

  const destinationUri = getPlayerVoiceUri(playerId);
  await deleteAsync(destinationUri, { idempotent: true });
  await moveAsync({ from: tempUri, to: destinationUri });

  return destinationUri;
}

export async function deletePlayerVoiceFile(voiceUri: string | null): Promise<void> {
  if (!voiceUri) {
    return;
  }

  await deleteAsync(voiceUri, { idempotent: true });
}
