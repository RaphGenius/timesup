import { StyleSheet, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

type GameLandscapeLayoutProps = ViewProps & {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  overlay?: React.ReactNode;
  fullBleedBody?: boolean;
};

export function GameLandscapeLayout({
  header,
  footer,
  overlay,
  fullBleedBody = false,
  children,
  style,
  ...rest
}: GameLandscapeLayoutProps) {
  return (
    <ThemedView style={[styles.container, style]} {...rest}>
      <SafeAreaView style={styles.safeArea} edges={[]}>
        {header ? <ThemedView style={styles.header}>{header}</ThemedView> : null}
        <ThemedView style={[styles.body, fullBleedBody && styles.bodyFullBleed]}>{children}</ThemedView>
        {footer ? <ThemedView style={styles.footer}>{footer}</ThemedView> : null}
        {overlay ? <ThemedView style={styles.overlay}>{overlay}</ThemedView> : null}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
  },
  bodyFullBleed: {
    paddingHorizontal: 0,
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
