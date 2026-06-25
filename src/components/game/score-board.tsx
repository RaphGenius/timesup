import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import type { Team } from '@/types/game';

type ScoreBoardProps = {
  scores: Record<Team, number>;
};

export function ScoreBoard({ scores }: ScoreBoardProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.scoreItem}>
        <ThemedText type="smallBold">Éq. 1</ThemedText>
        <ThemedText type="subtitle">{scores[1]}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.scoreItem}>
        <ThemedText type="smallBold">Éq. 2</ThemedText>
        <ThemedText type="subtitle">{scores[2]}</ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: Spacing.four,
  },
  scoreItem: {
    alignItems: 'center',
    gap: Spacing.one,
  },
});
