import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';

type TurnTimerProps = {
  seconds: number;
};

export function TurnTimer({ seconds }: TurnTimerProps) {
  return (
    <ThemedText type="subtitle" style={styles.timer}>
      {seconds}s
    </ThemedText>
  );
}

const styles = StyleSheet.create({
  timer: {
    textAlign: 'center',
  },
});
