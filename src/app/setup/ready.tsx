import { useRouter, type Href } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { PrimaryButton } from '@/components/primary-button';
import { ScreenLayout } from '@/components/screen-layout';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useGame } from '@/context/game-context';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { resolveStartingTeam } from '@/lib/game-engine';
import type { StartingTeamChoice } from '@/types/game';

const STARTING_TEAM_OPTIONS: { value: StartingTeamChoice; label: string }[] = [
  { value: 1, label: 'Équipe 1' },
  { value: 2, label: 'Équipe 2' },
  { value: 'random', label: 'Aléatoire' },
];

export default function ReadyScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { players, wordsPerPlayer, resetGame, startGame } = useGame();
  const [startingChoice, setStartingChoice] = useState<StartingTeamChoice>('random');

  useEffect(() => {
    if (players.length === 0) {
      router.replace('/');
    }
  }, [players.length, router]);

  const team1 = players.filter((player) => player.team === 1);
  const team2 = players.filter((player) => player.team === 2);
  const totalWords = players.length * wordsPerPlayer;

  const handlePlay = () => {
    startGame(resolveStartingTeam(startingChoice));
    router.push('/game' as Href);
  };

  const handleBackHome = () => {
    resetGame();
    router.replace('/');
  };

  if (players.length === 0) {
    return null;
  }

  return (
    <ScreenLayout
      title="C'est prêt !"
      subtitle={`${totalWords} mots enregistrés — la partie peut commencer`}
      scrollable
      footer={
        <ThemedView style={styles.footer}>
          <PrimaryButton label="Jouer" onPress={handlePlay} />
          <PrimaryButton label="Retour à l'accueil" onPress={handleBackHome} />
        </ThemedView>
      }>
      <ThemedView style={styles.content}>
        <ThemedView style={styles.summary}>
          <ThemedView style={styles.teamBlock}>
            <ThemedText type="smallBold">Équipe 1</ThemedText>
            <ThemedText themeColor="textSecondary" type="small">
              {team1.map((player) => player.name).join(', ')}
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.teamBlock}>
            <ThemedText type="smallBold">Équipe 2</ThemedText>
            <ThemedText themeColor="textSecondary" type="small">
              {team2.map((player) => player.name).join(', ')}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.startingSection}>
          <ThemedText type="smallBold" style={styles.startingLabel}>
            Qui commence ?
          </ThemedText>
          <ThemedView style={styles.startingOptions}>
            {STARTING_TEAM_OPTIONS.map((option) => {
              const selected = startingChoice === option.value;
              return (
                <Pressable
                  key={String(option.value)}
                  style={({ pressed }) => [
                    styles.startingOption,
                    {
                      backgroundColor: selected
                        ? theme.backgroundSelected
                        : theme.backgroundElement,
                    },
                    pressed && styles.pressed,
                  ]}
                  onPress={() => setStartingChoice(option.value)}>
                  <ThemedText type="smallBold">{option.label}</ThemedText>
                </Pressable>
              );
            })}
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    width: '100%',
    gap: Spacing.four,
  },
  footer: {
    flexDirection: 'row',
    gap: Spacing.two,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  summary: {
    gap: Spacing.three,
  },
  teamBlock: {
    gap: Spacing.one,
  },
  startingSection: {
    gap: Spacing.two,
    alignItems: 'center',
  },
  startingLabel: {
    textAlign: 'center',
  },
  startingOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  startingOption: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    minWidth: 100,
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});
