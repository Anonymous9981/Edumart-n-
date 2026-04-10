import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Theme } from '../theme/tokens';
import { ScreenShell } from './screen-shell';
import { AppButton } from './ui/app-button';
import { InfoCard } from './ui/info-card';

interface MorePageAction {
  label: string;
  route: string;
}

interface MorePageProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  overviewTitle: string;
  overview: string;
  bullets: string[];
  primaryAction?: MorePageAction;
  secondaryAction?: MorePageAction;
  footer?: ReactNode;
}

export function MorePage({
  eyebrow,
  title,
  subtitle,
  overviewTitle,
  overview,
  bullets,
  primaryAction,
  secondaryAction,
  footer,
}: MorePageProps) {
  const router = useRouter();

  return (
    <ScreenShell>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      <InfoCard title={overviewTitle} subtitle={overview} />

      <View style={styles.list}>
        {bullets.map((item) => (
          <View key={item} style={styles.listItem}>
            <Text style={styles.listText}>{item}</Text>
          </View>
        ))}
      </View>

      {(primaryAction || secondaryAction) && (
        <View style={styles.actions}>
          {primaryAction ? (
            <AppButton label={primaryAction.label} onPress={() => router.push(primaryAction.route)} />
          ) : null}
          {secondaryAction ? (
            <AppButton label={secondaryAction.label} variant="secondary" onPress={() => router.push(secondaryAction.route)} />
          ) : null}
        </View>
      )}

      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Theme.colors.accent,
  },
  title: {
    ...Theme.typo.title,
    color: Theme.colors.text,
    marginTop: 6,
  },
  subtitle: {
    ...Theme.typo.subtitle,
    color: Theme.colors.textMuted,
    marginTop: 4,
  },
  list: {
    gap: 10,
    marginTop: 6,
  },
  listItem: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    backgroundColor: Theme.colors.surfaceRaised,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  listText: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '600',
    color: Theme.colors.text,
  },
  actions: {
    marginTop: 4,
    gap: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  footer: {
    marginTop: 4,
  },
});
