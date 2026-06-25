import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';

import { PrimaryButton } from '@/components/primary-button';
import { ScreenLayout } from '@/components/screen-layout';
import { ThemedText } from '@/components/themed-text';
import { ThemedTextInput } from '@/components/themed-text-input';
import { ThemedView } from '@/components/themed-view';
import { useGame } from '@/context/game-context';
import { Spacing } from '@/constants/theme';

export default function PlayerNamesScreen() {
  const router = useRouter();
  const { players, setPlayerName } = useGame();

  useEffect(() => {
    if (players.length === 0) {
      router.replace('/setup/player-count');
    }
  }, [players.length, router]);

  const allNamesFilled = players.every((player) => player.name.trim().length > 0);

  const handleNext = () => {
    router.push('/setup/teams');
  };

  if (players.length === 0) {
    return null;
  }

  return (
    <ScreenLayout
      title="Noms des joueurs"
      subtitle="Indiquez le prénom de chaque joueur"
      scrollable
      footer={
        <PrimaryButton label="Suivant" onPress={handleNext} disabled={!allNamesFilled} />
      }>
      <ThemedView style={styles.list}>
        {players.map((player, index) => (
          <ThemedView key={player.id} style={styles.row}>
            <ThemedText type="smallBold">Joueur {index + 1}</ThemedText>
            <ThemedTextInput
              value={player.name}
              onChangeText={(value) => setPlayerName(index, value)}
              placeholder={`Nom du joueur ${index + 1}`}
              autoCapitalize="words"
              returnKeyType="next"
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
    gap: Spacing.three,
  },
  row: {
    width: '47%',
    gap: Spacing.one,
  },
});
