import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

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
    borderColor: '#d5e2f2',
    backgroundColor: '#ffffff',
    padding: 14,
    gap: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0B3558',
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 18,
    color: '#4f6d88',
  },
});
