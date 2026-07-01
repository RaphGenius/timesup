import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/primary-button';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type QuitGameButtonProps = {
  onConfirm: () => void;
};

export function QuitGameButton({ onConfirm }: QuitGameButtonProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(false);

  const handleConfirm = () => {
    setVisible(false);
    onConfirm();
  };

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Quitter la partie"
        onPress={() => setVisible(true)}
        style={({ pressed }) => [
          styles.homeButton,
          {
            top: insets.top + Spacing.two,
            left: insets.left + Spacing.two,
            backgroundColor: theme.backgroundElement,
          },
          pressed && styles.pressed,
        ]}>
        <SymbolView
          name="house.fill"
          size={22}
          tintColor={theme.text}
          fallback={<ThemedText type="small">⌂</ThemedText>}
        />
      </Pressable>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <Pressable style={styles.backdrop} onPress={() => setVisible(false)}>
          <Pressable
            style={[styles.dialog, { backgroundColor: theme.background }]}
            onPress={(event) => event.stopPropagation()}>
            <ThemedText type="subtitle" style={styles.dialogTitle}>
              Quitter la partie ?
            </ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.dialogMessage}>
              Tu reviendras au menu principal et la partie en cours sera perdue.
            </ThemedText>

            <View style={styles.dialogActions}>
              <PrimaryButton label="Annuler" onPress={() => setVisible(false)} />
              <Pressable
                accessibilityRole="button"
                onPress={handleConfirm}
                style={({ pressed }) => [
                  styles.quitButton,
                  { backgroundColor: theme.backgroundElement },
                  pressed && styles.pressed,
                ]}>
                <ThemedText type="default" style={styles.quitLabel}>
                  Quitter
                </ThemedText>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  homeButton: {
    position: 'absolute',
    zIndex: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
  },
  dialog: {
    width: '100%',
    maxWidth: 360,
    borderRadius: Spacing.three,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  dialogTitle: {
    textAlign: 'center',
  },
  dialogMessage: {
    textAlign: 'center',
  },
  dialogActions: {
    gap: Spacing.two,
  },
  quitButton: {
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.three,
    alignItems: 'center',
  },
  quitLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.7,
  },
});
