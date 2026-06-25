import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { PrimaryButton } from '@/components/primary-button';
import { ScreenLayout } from '@/components/screen-layout';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useGame } from '@/context/game-context';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Team } from '@/types/game';

export default function TeamsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { players, setPlayerTeam } = useGame();

  useEffect(() => {
    if (players.length === 0) {
      router.replace('/setup/player-count');
    }
  }, [players.length, router]);

  const allAssigned = players.length > 0 && players.every((player) => player.team !== null);

  const handleNext = () => {
    router.push('/setup/words');
  };

  if (players.length === 0) {
    return null;
  }

  return (
    <ScreenLayout
      title="Répartition des équipes"
      subtitle="2 équipes — assignez chaque joueur"
      scrollable
      footer={<PrimaryButton label="Suivant" onPress={handleNext} disabled={!allAssigned} />}>
      <ThemedView style={styles.teamsOverview}>
        <TeamBadge team={1} count={players.filter((player) => player.team === 1).length} />
        <TeamBadge team={2} count={players.filter((player) => player.team === 2).length} />
      </ThemedView>

      <ThemedView style={styles.list}>
        {players.map((player) => (
          <ThemedView key={player.id} style={styles.playerRow}>
            <ThemedText type="default" style={styles.playerName}>
              {player.name}
            </ThemedText>
            <ThemedView style={styles.teamButtons}>
              {([1, 2] as Team[]).map((team) => {
                const selected = player.team === team;
                return (
                  <Pressable
                    key={team}
                    style={({ pressed }) => [
                      styles.teamButton,
                      {
                        backgroundColor: selected
                          ? theme.backgroundSelected
                          : theme.backgroundElement,
                      },
                      pressed && styles.pressed,
                    ]}
                    onPress={() => setPlayerTeam(player.id, team)}>
                    <ThemedText type="smallBold">Équipe {team}</ThemedText>
                  </Pressable>
                );
              })}
            </ThemedView>
          </ThemedView>
        ))}
      </ThemedView>
    </ScreenLayout>
  );
}

function TeamBadge({ team, count }: { team: Team; count: number }) {
  const theme = useTheme();

  return (
    <ThemedView style={[styles.badge, { backgroundColor: theme.backgroundElement }]}>
      <ThemedText type="smallBold">Équipe {team}</ThemedText>
      <ThemedText themeColor="textSecondary" type="small">
        {count} joueur{count > 1 ? 's' : ''}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  teamsOverview: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  badge: {
    flex: 1,
    padding: Spacing.three,
    borderRadius: Spacing.two,
    alignItems: 'center',
    gap: Spacing.one,
  },
  list: {
    gap: Spacing.three,
  },
  playerRow: {
    gap: Spacing.two,
  },
  playerName: {
    fontWeight: '600',
  },
  teamButtons: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  teamButton: {
    flex: 1,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});
