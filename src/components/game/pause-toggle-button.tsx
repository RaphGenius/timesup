import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type PauseToggleButtonProps = {
  isPaused: boolean;
  onPress: () => void;
  disabled?: boolean;
};

export function PauseToggleButton({ isPaused, onPress, disabled = false }: PauseToggleButtonProps) {
  const theme = useTheme();
  const iconName = isPaused ? 'play.fill' : 'pause.fill';

  return (
    <Pressable
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={isPaused ? 'Reprendre' : 'Pause'}
      style={({ pressed }) => [
        styles.button,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
      onPress={onPress}>
      <SymbolView
        name={iconName}
        size={28}
        tintColor={theme.text}
        fallback={
          <ThemedText type="subtitle">{isPaused ? '▶' : '⏸'}</ThemedText>
        }
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: Spacing.two,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.4,
  },
});
