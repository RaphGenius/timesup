import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const ZONE_ICON_SIZE = 72;

type SplitTapZonesProps = {
  onFound: () => void;
  onSkip: () => void;
  word: string;
  disabled?: boolean;
};

export function SplitTapZones({ onFound, onSkip, word, disabled = false }: SplitTapZonesProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Pressable
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel="Valider"
        style={({ pressed }) => [
          styles.zone,
          styles.leftZone,
          { backgroundColor: theme.zoneLeft },
          disabled && styles.disabled,
          pressed && !disabled && styles.pressed,
        ]}
        onPress={onFound}>
        <SymbolView
          name="checkmark"
          size={ZONE_ICON_SIZE}
          tintColor={theme.text}
          fallback={<ThemedText style={styles.fallbackIcon}>✓</ThemedText>}
        />
      </Pressable>

      <Pressable
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel="Passer"
        style={({ pressed }) => [
          styles.zone,
          styles.rightZone,
          {
            backgroundColor: theme.zoneRight,
            borderLeftColor: theme.zoneDivider,
          },
          disabled && styles.disabled,
          pressed && !disabled && styles.pressed,
        ]}
        onPress={onSkip}>
        <SymbolView
          name="xmark"
          size={ZONE_ICON_SIZE}
          tintColor={theme.text}
          fallback={<ThemedText style={styles.fallbackIcon}>✕</ThemedText>}
        />
      </Pressable>

      <View style={styles.wordContainer} pointerEvents="none">
        <ThemedText type="title" style={styles.word}>
          {word}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    flexDirection: 'row',
  },
  zone: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftZone: {
    flex: 1,
  },
  rightZone: {
    flex: 1,
    borderLeftWidth: 2,
  },
  fallbackIcon: {
    fontSize: ZONE_ICON_SIZE,
    lineHeight: ZONE_ICON_SIZE + 8,
    fontWeight: '700',
    textAlign: 'center',
  },
  wordContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.five,
  },
  word: {
    fontSize: 48,
    lineHeight: 56,
    fontWeight: '700',
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
});
