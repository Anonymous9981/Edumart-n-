import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

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
  },
  primary: {
    backgroundColor: '#0B3558',
  },
  secondary: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d5e2f2',
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
  },
  primaryLabel: {
    color: '#ffffff',
  },
  secondaryLabel: {
    color: '#0B3558',
  },
});
