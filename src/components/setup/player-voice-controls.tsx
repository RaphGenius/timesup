import { ThemedText } from '@/components/themed-text';
import { isExpoAudioAvailable } from '@/lib/expo-audio';

type PlayerVoiceControlsProps = {
  playerId: string;
  voiceUri: string | null;
  onVoiceChange: (voiceUri: string | null) => void;
};

export function PlayerVoiceControls(props: PlayerVoiceControlsProps) {
  if (!isExpoAudioAvailable()) {
    if (__DEV__) {
      return (
        <ThemedText themeColor="textSecondary" type="small">
          Voix indisponible — installe le nouveau dev client
        </ThemedText>
      );
    }

    return null;
  }

  const { PlayerVoiceControlsInner } = require('./player-voice-controls-inner') as typeof import('./player-voice-controls-inner');

  return <PlayerVoiceControlsInner {...props} />;
}
