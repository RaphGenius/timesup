import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Keyboard, Platform, StyleSheet, type TextInput } from 'react-native';

import { PrimaryButton } from '@/components/primary-button';
import { ScreenLayout } from '@/components/screen-layout';
import { ThemedTextInput } from '@/components/themed-text-input';
import { ThemedView } from '@/components/themed-view';
import { useGame } from '@/context/game-context';
import { Spacing } from '@/constants/theme';
import { useBlockBackNavigation } from '@/hooks/use-block-back-navigation';
import { useKeyboardVisible } from '@/hooks/use-keyboard-visible';
import { parseRouteIndex } from '@/lib/setup-route-params';
import { createEmptyWords, WORDS_PER_PLAYER } from '@/types/game';

function normalizeWords(value: unknown): string[] {
  if (Array.isArray(value) && value.every((item) => typeof item === 'string')) {
    if (value.length === WORDS_PER_PLAYER) {
      return [...value];
    }
  }

  return createEmptyWords();
}

export default function PlayerWordsScreen() {
  const router = useRouter();
  const { index: indexParam } = useLocalSearchParams<{ index: string }>();
  const playerIndex = parseRouteIndex(indexParam);
  const { players, setPlayerWords, wordsPerPlayer } = useGame();
  const [wordIndex, setWordIndex] = useState(0);
  const [draftWords, setDraftWords] = useState<string[]>(() => createEmptyWords());
  const inputRef = useRef<TextInput | null>(null);
  const isKeyboardVisible = useKeyboardVisible();

  useBlockBackNavigation();

  const currentPlayer = playerIndex !== null ? players[playerIndex] : undefined;
  const isLastWord = wordIndex >= wordsPerPlayer - 1;
  const isLastPlayer = playerIndex !== null && playerIndex >= players.length - 1;
  const draftWord = draftWords[wordIndex] ?? '';

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

    setWordIndex(0);
    setDraftWords(normalizeWords(currentPlayer.words));
  }, [currentPlayer?.id]);

  useEffect(() => {
    let cancelled = false;

    const focusInput = () => {
      if (!cancelled) {
        inputRef.current?.focus();
      }
    };

    const focusDelay = Platform.OS === 'ios' ? 100 : 200;

    if (Keyboard.isVisible()) {
      Keyboard.dismiss();
      const timeout = setTimeout(focusInput, focusDelay);
      return () => {
        cancelled = true;
        clearTimeout(timeout);
      };
    }

    const timeout = setTimeout(focusInput, focusDelay);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [currentPlayer?.id]);

  if (playerIndex === null || !currentPlayer) {
    return null;
  }

  const trimmedWord = draftWord.trim();
  const canContinue = trimmedWord.length > 0;

  const handleWordChange = (value: string) => {
    setDraftWords((previousWords) => {
      const words = normalizeWords(previousWords);
      words[wordIndex] = value;
      return words;
    });
  };

  const persistDraftWords = (words: string[]) => {
    const normalized = normalizeWords(words);
    setDraftWords(normalized);
    setPlayerWords(currentPlayer.id, normalized);
    return normalized;
  };

  const handlePrevious = () => {
    if (wordIndex <= 0) {
      return;
    }

    const words = normalizeWords(draftWords);
    words[wordIndex] = draftWord;
    persistDraftWords(words);

    const previousIndex = wordIndex - 1;
    setWordIndex(previousIndex);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const handleContinue = () => {
    if (!canContinue) {
      return;
    }

    const words = normalizeWords(draftWords);
    words[wordIndex] = trimmedWord;
    persistDraftWords(words);

    if (!isLastWord) {
      const nextIndex = wordIndex + 1;
      setWordIndex(nextIndex);
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
      return;
    }

    if (isLastPlayer) {
      router.replace('/setup/teams');
      return;
    }

    router.replace(`/setup/player/${playerIndex + 1}` as Href);
  };

  const canGoPrevious = wordIndex > 0;

  return (
    <ScreenLayout
      title={`Mot ${wordIndex + 1}`}
      subtitle={`${wordIndex + 1} / ${wordsPerPlayer} — Joueur ${playerIndex + 1}`}
      scrollable
      centerContent={!isKeyboardVisible}
      keyboardShouldPersistTaps="always">
      <ThemedView style={styles.content}>
        <ThemedView style={styles.inputWrapper}>
          <ThemedTextInput
            ref={inputRef}
            value={draftWord}
            onChangeText={handleWordChange}
            placeholder="Saisis un mot"
            autoCapitalize="none"
            autoCorrect={false}
            multiline={false}
            numberOfLines={1}
            blurOnSubmit={false}
            returnKeyType={isLastWord ? 'done' : 'next'}
            onSubmitEditing={handleContinue}
            style={styles.input}
          />
        </ThemedView>
        <ThemedView style={styles.actions}>
          <PrimaryButton
            label="Précédent"
            onPress={handlePrevious}
            disabled={!canGoPrevious}
            style={styles.actionButton}
          />
          <PrimaryButton
            label={isLastWord ? (isLastPlayer ? 'Terminer' : 'Joueur suivant') : 'Suivant'}
            onPress={handleContinue}
            disabled={!canContinue}
            style={styles.actionButton}
          />
        </ThemedView>
      </ThemedView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    width: '100%',
    alignItems: 'stretch',
    gap: Spacing.four,
  },
  inputWrapper: {
    width: '100%',
  },
  input: {
    fontSize: 24,
    paddingVertical: Spacing.three,
    textAlign: 'center',
    width: '100%',
  },
  actions: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'stretch',
    columnGap: Spacing.two,
  },
  actionButton: {
    flex: 1,
    width: 0,
    maxWidth: '50%',
    alignSelf: 'stretch',
  },
});
