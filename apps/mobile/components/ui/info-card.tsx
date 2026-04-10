import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Theme } from '../../theme/tokens';

interface InfoCardProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export function InfoCard({ title, subtitle, children }: InfoCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    backgroundColor: Theme.colors.surface,
    padding: 14,
    gap: 8,
    ...Theme.shadows.neumorph,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: Theme.colors.text,
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 18,
    color: Theme.colors.textMuted,
  },
});
