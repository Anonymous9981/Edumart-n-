import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { Theme } from '../../theme/tokens';

interface AppButtonProps {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary';
  icon?: ReactNode;
}

export function AppButton({ label, onPress, variant = 'primary', icon }: AppButtonProps) {
  return (
    <Pressable style={[styles.base, variant === 'primary' ? styles.primary : styles.secondary]} onPress={onPress}>
      {icon}
      <Text style={[styles.label, variant === 'primary' ? styles.primaryLabel : styles.secondaryLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    ...Theme.shadows.neumorph,
  },
  primary: {
    backgroundColor: Theme.colors.accentSoft,
    borderWidth: 1,
    borderColor: Theme.colors.accent,
  },
  secondary: {
    backgroundColor: Theme.colors.surface,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
  },
  primaryLabel: {
    color: Theme.colors.accent,
  },
  secondaryLabel: {
    color: Theme.colors.text,
  },
});
