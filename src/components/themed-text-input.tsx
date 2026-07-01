import { forwardRef } from 'react';
import { StyleSheet, TextInput, type TextInputProps } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export const ThemedTextInput = forwardRef<TextInput, TextInputProps>(function ThemedTextInput(
  { style, placeholderTextColor, ...rest },
  ref,
) {
  const theme = useTheme();

  return (
    <TextInput
      ref={ref}
      style={[
        styles.input,
        {
          color: theme.text,
          backgroundColor: theme.backgroundElement,
          borderColor: theme.backgroundSelected,
        },
        style,
      ]}
      placeholderTextColor={placeholderTextColor ?? theme.textSecondary}
      {...rest}
    />
  );
});

const styles = StyleSheet.create({
  input: {
    fontSize: 16,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    borderWidth: 1,
  },
});
