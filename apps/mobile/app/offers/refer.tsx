import { StyleSheet, Text, View } from 'react-native';

import { ScreenShell } from '../../components/screen-shell';
import { useAppTheme } from '../../theme/theme-provider';
import { InfoCard } from '../../components/ui/info-card';

export default function ReferOfferScreen() {
  const { theme } = useAppTheme();
  const styles = getStyles(theme);

  return (
    <ScreenShell>
      <Text style={styles.title}>Refer to Earn</Text>
      <Text style={styles.subtitle}>Invite classmates and parents, then earn wallet rewards.</Text>

      <InfoCard title="₹100 Reward" subtitle="Reward credited after referred order above ₹499 is completed.">
        <View style={styles.list}>
          <Text style={styles.listItem}>• Share your referral code</Text>
          <Text style={styles.listItem}>• Friend places first valid order</Text>
          <Text style={styles.listItem}>• Reward appears in your wallet</Text>
          <Text style={styles.listItem}>• Referral tracking updates in account history</Text>
        </View>
      </InfoCard>
    </ScreenShell>
  );
}

const getStyles = (theme: ReturnType<typeof useAppTheme>['theme']) =>
  StyleSheet.create({
    title: {
      ...theme.typo.title,
      color: theme.colors.text,
    },
    subtitle: {
      marginTop: -4,
      ...theme.typo.subtitle,
      color: theme.colors.textMuted,
    },
    list: {
      gap: 6,
    },
    listItem: {
      fontSize: 13,
      color: theme.colors.text,
      fontWeight: '600',
    },
  });
