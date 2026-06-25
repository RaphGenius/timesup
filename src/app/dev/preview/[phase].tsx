import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { GamePhaseView } from '@/components/game/game-phase-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { getDevPhaseId, getDevPreviewData } from '@/lib/dev-fixtures';

export default function DevPhasePreviewScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { phase } = useLocalSearchParams<{ phase: string }>();
  const phaseId = getDevPhaseId(phase);

  useEffect(() => {
    if (!__DEV__) {
      router.replace('/');
    }
  }, [router]);

  useEffect(() => {
    if (__DEV__ && !phaseId) {
      router.replace('/dev');
    }
  }, [phaseId, router]);

  if (!__DEV__ || !phaseId) {
    return null;
  }

  const { playState, activePlayer, currentMethod } = getDevPreviewData(phaseId);

  return (
    <ThemedView style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.backButton,
          { backgroundColor: theme.backgroundElement },
          pressed && styles.pressed,
        ]}
        onPress={() => router.back()}>
        <ThemedText type="smallBold">← Retour</ThemedText>
      </Pressable>

      <ThemedView style={styles.preview}>
        <GamePhaseView
          playState={playState}
          activePlayer={activePlayer}
          currentMethod={currentMethod}
          onStartCountdown={() => {}}
          onWordFound={() => {}}
          onWordSkipped={() => {}}
          onNextRound={() => {}}
          onBackHome={() => {}}
          previewMode
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: Spacing.three,
    left: Spacing.three,
    zIndex: 10,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
  },
  preview: {
    flex: 1,
  },
  pressed: {
    opacity: 0.7,
  },
});
