import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Keyboard, StyleSheet, type TextInput } from 'react-native';

import { PrimaryButton } from '@/components/primary-button';
import { PlayerVoiceControls } from '@/components/setup/player-voice-controls';
import { ScreenLayout } from '@/components/screen-layout';
import { ThemedText } from '@/components/themed-text';
import { ThemedTextInput } from '@/components/themed-text-input';
import { ThemedView } from '@/components/themed-view';
import { useGame } from '@/context/game-context';
import { Spacing } from '@/constants/theme';
import { useBlockBackNavigation } from '@/hooks/use-block-back-navigation';
import { parseRouteIndex } from '@/lib/setup-route-params';

export default function PlayerProfileScreen() {
  const router = useRouter();
  const { index: indexParam } = useLocalSearchParams<{ index: string }>();
  const playerIndex = parseRouteIndex(indexParam);
  const { players, setPlayerName, setPlayerVoice } = useGame();
  const [draftName, setDraftName] = useState('');
  const nameInputRef = useRef<TextInput | null>(null);

  useBlockBackNavigation();

  const currentPlayer = playerIndex !== null ? players[playerIndex] : undefined;

  useEffect(() => {
    if (players.length === 0) {
      router.replace('/setup/player-count');
      return;
    }

    if (playerIndex === null || playerIndex >= players.length) {
      router.replace('/setup/player-count');
    }
  }, [playerIndex, players.length, router]);

  useEffect(() => {
    if (!currentPlayer) {
      return;
    }

    setDraftName(currentPlayer.name);
  }, [currentPlayer?.id]);

  if (playerIndex === null || !currentPlayer) {
    return null;
  }

  const trimmedName = draftName.trim();
  const canContinue = trimmedName.length > 0;

  const handleContinue = () => {
    if (!canContinue) {
      return;
    }

    setPlayerName(playerIndex, trimmedName);
    nameInputRef.current?.blur();
    Keyboard.dismiss();
    router.replace(`/setup/player/${playerIndex}/word` as Href);
  };

  return (
    <ScreenLayout
      title={`Joueur ${playerIndex + 1}`}
      subtitle={
        playerIndex === 0
          ? 'Prends le téléphone et remplis tes informations sans que les autres regardent.'
          : 'Ajoute tes informations sans que les autres regardent.'
      }
      scrollable
      pageStyle={styles.page}
      footerStyle={styles.footer}
      footer={<PrimaryButton label="Suivant" onPress={handleContinue} disabled={!canContinue} />}>
      <ThemedView style={styles.section}>
        <ThemedText type="smallBold">Prénom</ThemedText>
        <ThemedTextInput
          ref={nameInputRef}
          value={draftName}
          onChangeText={setDraftName}
          placeholder="Ton prénom"
          autoCapitalize="words"
          returnKeyType="done"
          onSubmitEditing={handleContinue}
        />
        <PlayerVoiceControls
          playerId={currentPlayer.id}
          voiceUri={currentPlayer.voiceUri}
          onVoiceChange={(voiceUri) => setPlayerVoice(currentPlayer.id, voiceUri)}
        />
      </ThemedView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingBottom: Spacing.one,
  },
  footer: {
    paddingTop: Spacing.one,
    paddingBottom: 0,
  },
  section: {
    gap: Spacing.two,
  },
});
