import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, type TextInput } from 'react-native';

import { PrimaryButton } from '@/components/primary-button';
import { PlayerVoiceControls } from '@/components/setup/player-voice-controls';
import { ScreenLayout } from '@/components/screen-layout';
import { ThemedText } from '@/components/themed-text';
import { ThemedTextInput } from '@/components/themed-text-input';
import { ThemedView } from '@/components/themed-view';
import { useGame } from '@/context/game-context';
import { Spacing } from '@/constants/theme';
import { useBlockBackNavigation } from '@/hooks/use-block-back-navigation';
import { createEmptyWords, WORDS_PER_PLAYER } from '@/types/game';

function normalizeWords(value: unknown): string[] {
  if (Array.isArray(value) && value.every((item) => typeof item === 'string')) {
    if (value.length === WORDS_PER_PLAYER) {
      return [...value];
    }
  }

  return createEmptyWords();
}

function parsePlayerIndex(value: string | string[] | undefined): number | null {
  const raw = Array.isArray(value) ? value[0] : value;
  const index = Number(raw);

  if (!Number.isInteger(index) || index < 0) {
    return null;
  }

  return index;
}

export default function PlayerSetupScreen() {
  const router = useRouter();
  const { index: indexParam } = useLocalSearchParams<{ index: string }>();
  const playerIndex = parsePlayerIndex(indexParam);
  const { players, setPlayerName, setPlayerVoice, setPlayerWords, wordsPerPlayer } = useGame();
  const [draftName, setDraftName] = useState('');
  const [draftWords, setDraftWords] = useState<string[]>(() => createEmptyWords());
  const nameInputRef = useRef<TextInput | null>(null);
  const wordInputRefs = useRef<(TextInput | null)[]>([]);

  useBlockBackNavigation();

  const currentPlayer = playerIndex !== null ? players[playerIndex] : undefined;
  const isLastPlayer = playerIndex !== null && playerIndex >= players.length - 1;

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
    setDraftWords(normalizeWords(currentPlayer.words));
  }, [currentPlayer?.id]);

  if (playerIndex === null || !currentPlayer) {
    return null;
  }

  const trimmedName = draftName.trim();
  const allWordsFilled = draftWords.every((word) => word.trim().length > 0);
  const canContinue = trimmedName.length > 0 && allWordsFilled;

  const handleWordChange = (index: number, value: string) => {
    setDraftWords((previousWords) => {
      const words = normalizeWords(previousWords);
      return words.map((word, wordIndex) => (wordIndex === index ? value : word));
    });
  };

  const focusWordInput = (index: number) => {
    wordInputRefs.current[index]?.focus();
  };

  const handleContinue = () => {
    if (!canContinue) {
      return;
    }

    setPlayerName(playerIndex, trimmedName);
    setPlayerWords(
      currentPlayer.id,
      draftWords.map((word) => word.trim()),
    );

    if (isLastPlayer) {
      router.replace('/setup/teams');
      return;
    }

    router.replace(`/setup/player/${playerIndex + 1}` as Href);
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
      footer={
        <PrimaryButton
          label={isLastPlayer ? 'Terminer' : 'Suivant'}
          onPress={handleContinue}
          disabled={!canContinue}
        />
      }>
      <ThemedView style={styles.section}>
        <ThemedText type="smallBold">Prénom</ThemedText>
        <ThemedTextInput
          ref={nameInputRef}
          value={draftName}
          onChangeText={setDraftName}
          placeholder="Ton prénom"
          autoCapitalize="words"
          returnKeyType="next"
          onSubmitEditing={() => focusWordInput(0)}
        />
        <PlayerVoiceControls
          playerId={currentPlayer.id}
          voiceUri={currentPlayer.voiceUri}
          onVoiceChange={(voiceUri) => setPlayerVoice(currentPlayer.id, voiceUri)}
        />
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="smallBold">
          Tes {wordsPerPlayer} mots ({playerIndex + 1}/{players.length})
        </ThemedText>
        <ThemedView style={styles.wordList}>
          {draftWords.map((word, index) => {
            const isLast = index === draftWords.length - 1;

            return (
              <ThemedView key={index} style={styles.wordRow}>
                <ThemedText type="smallBold">Mot {index + 1}</ThemedText>
                <ThemedTextInput
                  ref={(ref) => {
                    wordInputRefs.current[index] = ref;
                  }}
                  value={word}
                  onChangeText={(value) => handleWordChange(index, value)}
                  placeholder={`Mot ${index + 1}`}
                  autoCapitalize="none"
                  returnKeyType={isLast ? 'done' : 'next'}
                  blurOnSubmit={isLast}
                  onSubmitEditing={() => {
                    if (!isLast) {
                      focusWordInput(index + 1);
                    }
                  }}
                />
              </ThemedView>
            );
          })}
        </ThemedView>
      </ThemedView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.two,
  },
  wordList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  wordRow: {
    width: '31%',
    minWidth: 140,
    gap: Spacing.one,
  },
});
