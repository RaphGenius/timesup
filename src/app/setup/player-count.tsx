import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { PrimaryButton } from '@/components/primary-button';
import { ScreenLayout } from '@/components/screen-layout';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useGame } from '@/context/game-context';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function PlayerCountScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { minPlayers, maxPlayers, initPlayers } = useGame();
  const [count, setCount] = useState(minPlayers);

  const decrease = () => setCount((value) => Math.max(minPlayers, value - 1));
  const increase = () => setCount((value) => Math.min(maxPlayers, value + 1));

  const handleNext = () => {
    initPlayers(count);
    router.push('/setup/player-names');
  };

  return (
    <ScreenLayout
      title="Nombre de joueurs"
      subtitle={`Entre ${minPlayers} et ${maxPlayers} joueurs`}
      footer={<PrimaryButton label="Valider" onPress={handleNext} />}>
      <ThemedView style={styles.counter}>
        <Pressable
          style={({ pressed }) => [
            styles.counterButton,
            { backgroundColor: theme.backgroundElement },
            pressed && styles.pressed,
          ]}
          onPress={decrease}>
          <ThemedText type="subtitle">−</ThemedText>
        </Pressable>

        <ThemedText type="title" style={styles.count}>
          {count}
        </ThemedText>

        <Pressable
          style={({ pressed }) => [
            styles.counterButton,
            { backgroundColor: theme.backgroundElement },
            pressed && styles.pressed,
          ]}
          onPress={increase}>
          <ThemedText type="subtitle">+</ThemedText>
        </Pressable>
      </ThemedView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.five,
  },
  counterButton: {
    width: 56,
    height: 56,
    borderRadius: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: {
    minWidth: 80,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});
