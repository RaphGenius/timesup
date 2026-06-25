import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { ScreenLayout } from '@/components/screen-layout';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { DEV_PHASE_PREVIEWS } from '@/lib/dev-fixtures';

export default function DevMenuScreen() {
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    if (!__DEV__) {
      router.replace('/');
    }
  }, [router]);

  if (!__DEV__) {
    return null;
  }

  return (
    <ScreenLayout
      title="Mode développeur"
      subtitle="Prévisualisation des phases sans timer"
      scrollable>
      <ThemedView style={styles.list}>
        {DEV_PHASE_PREVIEWS.map((preview) => (
          <Pressable
            key={preview.id}
            style={({ pressed }) => [
              styles.item,
              { backgroundColor: theme.backgroundElement },
              pressed && styles.pressed,
            ]}
            onPress={() => router.push(`/dev/preview/${preview.id}`)}>
            <ThemedText type="default" style={styles.itemTitle}>
              {preview.title}
            </ThemedText>
            <ThemedText themeColor="textSecondary" type="small">
              {preview.subtitle}
            </ThemedText>
          </Pressable>
        ))}
      </ThemedView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.two,
    paddingBottom: Spacing.four,
  },
  item: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.one,
  },
  itemTitle: {
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.7,
  },
});
