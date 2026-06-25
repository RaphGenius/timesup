import { useRouter } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useGame } from '@/context/game-context';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { resetGame } = useGame();

  const handlePlay = () => {
    resetGame();
    router.push('/setup/player-count');
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.page}>
          <ThemedText type="title" style={styles.title}>
            Timesup
          </ThemedText>

          <ThemedView style={styles.actions}>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                { backgroundColor: theme.backgroundElement },
                pressed && styles.buttonPressed,
              ]}
              onPress={handlePlay}>
              <ThemedText type="subtitle">Jouer</ThemedText>
            </Pressable>

            {__DEV__ ? (
              <Pressable
                style={({ pressed }) => [
                  styles.devButton,
                  { backgroundColor: theme.backgroundElement },
                  pressed && styles.buttonPressed,
                ]}
                onPress={() => router.push('/dev')}>
                <ThemedText type="small" themeColor="textSecondary">
                  Mode développeur
                </ThemedText>
              </Pressable>
            ) : null}
          </ThemedView>
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  page: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  title: {
    textAlign: 'center',
    paddingTop: Spacing.two,
  },
  actions: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.three,
  },
  devButton: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.three,
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: Spacing.six,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.7,
  },
});
