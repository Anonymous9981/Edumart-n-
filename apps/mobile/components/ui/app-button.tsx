import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { useAppTheme } from '../../theme/theme-provider';

interface AppButtonProps {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary';
  icon?: ReactNode;
}

export function AppButton({ label, onPress, variant = 'primary', icon }: AppButtonProps) {
  const { theme } = useAppTheme();
  const styles = getStyles(theme);

  return (
    <Pressable style={[styles.base, variant === 'primary' ? styles.primary : styles.secondary]} onPress={onPress}>
      {icon}
      <Text style={[styles.label, variant === 'primary' ? styles.primaryLabel : styles.secondaryLabel]}>{label}</Text>
    </Pressable>
  );
}

const getStyles = (theme: ReturnType<typeof useAppTheme>['theme']) =>
  StyleSheet.create({
    base: {
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 12,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 8,
      ...theme.shadows.neumorph,
    },
    primary: {
      backgroundColor: theme.colors.accent,
      borderWidth: 1,
      borderColor: theme.colors.accent,
    },
    secondary: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    label: {
      fontSize: 13,
      fontWeight: '800',
    },
    primaryLabel: {
      color: theme.isDark ? '#11131B' : '#F7FAFF',
    },
    secondaryLabel: {
      color: theme.colors.text,
    },
  });
