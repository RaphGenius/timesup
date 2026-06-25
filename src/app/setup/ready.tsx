import { useRouter, type Href } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';

import { PrimaryButton } from '@/components/primary-button';
import { ScreenLayout } from '@/components/screen-layout';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useGame } from '@/context/game-context';
import { Spacing } from '@/constants/theme';

export default function ReadyScreen() {
  const router = useRouter();
  const { players, resetGame, startGame } = useGame();

  useEffect(() => {
    if (players.length === 0) {
      router.replace('/');
    }
  }, [players.length, router]);

  const team1 = players.filter((player) => player.team === 1);
  const team2 = players.filter((player) => player.team === 2);
  const totalWords = players.length * 5;

  const handlePlay = () => {
    startGame();
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
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  footer: {
    gap: Spacing.two,
  },
  summary: {
    gap: Spacing.four,
  },
  teamBlock: {
    gap: Spacing.one,
  },
});
