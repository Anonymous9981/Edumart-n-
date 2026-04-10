import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '../../theme/theme-provider';

interface InfoCardProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export function InfoCard({ title, subtitle, children }: InfoCardProps) {
  const { theme } = useAppTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {children}
    </View>
  );
}

const getStyles = (theme: ReturnType<typeof useAppTheme>['theme']) =>
  StyleSheet.create({
    card: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      padding: 14,
      gap: 8,
      ...theme.shadows.neumorph,
    },
    title: {
      fontSize: 15,
      fontWeight: '800',
      color: theme.colors.text,
    },
    subtitle: {
      fontSize: 12,
      lineHeight: 18,
      color: theme.colors.textMuted,
    },
  });
