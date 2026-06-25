import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

type ScreenLayoutProps = ViewProps & {
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  scrollable?: boolean;
};

export function ScreenLayout({
  title,
  subtitle,
  footer,
  scrollable = false,
  children,
  style,
  ...rest
}: ScreenLayoutProps) {
  const body = scrollable ? (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  ) : (
    <ThemedView style={styles.content}>{children}</ThemedView>
  );

  return (
    <ThemedView style={[styles.container, style]} {...rest}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ThemedView style={styles.page}>
            {title || subtitle ? (
              <ThemedView style={styles.header}>
                {title ? (
                  <ThemedText type="subtitle" style={styles.title}>
                    {title}
                  </ThemedText>
                ) : null}
                {subtitle ? (
                  <ThemedText themeColor="textSecondary" type="small" style={styles.subtitle}>
                    {subtitle}
                  </ThemedText>
                ) : null}
              </ThemedView>
            ) : null}

            {body}

            {footer ? <ThemedView style={styles.footer}>{footer}</ThemedView> : null}
          </ThemedView>
        </KeyboardAvoidingView>
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
  flex: {
    flex: 1,
  },
  page: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  header: {
    alignItems: 'center',
    gap: Spacing.one,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.three,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.three,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    gap: Spacing.three,
    paddingBottom: Spacing.two,
  },
  footer: {
    alignItems: 'center',
    paddingTop: Spacing.three,
    paddingBottom: Spacing.two,
  },
});
