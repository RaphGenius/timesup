import { useEffect } from 'react';

import { getExpoAudio } from '@/lib/expo-audio';
import type { GamePhase } from '@/types/game';

export function usePlayerVoicePlayback(
  phase: GamePhase | undefined,
  activePlayerId: string | undefined,
  voiceUri: string | null | undefined,
) {
  useEffect(() => {
    const audio = getExpoAudio();
    if (!audio || phase !== 'pre-turn' || !activePlayerId || !voiceUri) {
      return;
    }

    try {
      void audio.setAudioModeAsync({ playsInSilentMode: true });

      const player = audio.createAudioPlayer(voiceUri);
      void player.seekTo(0).then(() => {
        player.play();
      });

      return () => {
        player.pause();
        player.remove();
      };
    } catch {
      return;
    }
  }, [phase, activePlayerId, voiceUri]);
}
