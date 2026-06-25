import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

import { PrimaryButton } from '@/components/primary-button';
import { ScreenLayout } from '@/components/screen-layout';
import { ThemedText } from '@/components/themed-text';
import { ThemedTextInput } from '@/components/themed-text-input';
import { ThemedView } from '@/components/themed-view';
import { useGame } from '@/context/game-context';
import { Spacing } from '@/constants/theme';
import { createEmptyWords } from '@/types/game';

export default function WordsScreen() {
  const router = useRouter();
  const { players, setPlayerWords, wordsPerPlayer } = useGame();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [words, setWords] = useState<string[]>(createEmptyWords());

  const currentPlayer = players[currentIndex];

  useEffect(() => {
    if (players.length === 0) {
      router.replace('/setup/player-count');
    }
  }, [players.length, router]);

  useEffect(() => {
    if (currentPlayer) {
      setWords([...currentPlayer.words]);
    }
  }, [currentPlayer?.id]);

  if (!currentPlayer) {
    return null;
  }

  const allWordsFilled = words.every((word) => word.trim().length > 0);

  const handleWordChange = (index: number, value: string) => {
    setWords((current) => current.map((word, i) => (i === index ? value : word)));
  };

  const handleValidate = () => {
    const trimmedWords = words.map((word) => word.trim());
    setPlayerWords(currentPlayer.id, trimmedWords);

    const nextIndex = currentIndex + 1;
    if (nextIndex >= players.length) {
      router.replace('/setup/ready');
      return;
    }

    setCurrentIndex(nextIndex);
    setWords(createEmptyWords());
  };

  return (
    <ScreenLayout
      title={currentPlayer.name}
      subtitle={`Ajoutez ${wordsPerPlayer} mots (${currentIndex + 1}/${players.length})`}
      scrollable
      footer={
        <PrimaryButton label="Valider" onPress={handleValidate} disabled={!allWordsFilled} />
      }>
      <ThemedView style={styles.list}>
        {words.map((word, index) => (
          <ThemedView key={index} style={styles.row}>
            <ThemedText type="smallBold">Mot {index + 1}</ThemedText>
            <ThemedTextInput
              value={word}
              onChangeText={(value) => handleWordChange(index, value)}
              placeholder={`Mot ${index + 1}`}
              autoCapitalize="none"
              returnKeyType={index === words.length - 1 ? 'done' : 'next'}
            />
          </ThemedView>
        ))}
      </ThemedView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  row: {
    width: '31%',
    minWidth: 140,
    gap: Spacing.one,
  },
});
