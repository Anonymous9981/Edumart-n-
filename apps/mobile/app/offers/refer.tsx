import { StyleSheet, Text, View } from 'react-native';

import { ScreenShell } from '../../components/screen-shell';
import { Theme } from '../../theme/tokens';
import { InfoCard } from '../../components/ui/info-card';

export default function ReferOfferScreen() {
  return (
    <ScreenShell>
      <Text style={styles.title}>Refer to Earn</Text>
      <Text style={styles.subtitle}>Rewarded referrals for customers and schools.</Text>

      <InfoCard title="₹100 Reward" subtitle="Reward credited after referred order above ₹499 is completed.">
        <View style={styles.list}>
          <Text style={styles.listItem}>• Share your referral code</Text>
          <Text style={styles.listItem}>• Friend places first valid order</Text>
          <Text style={styles.listItem}>• Reward appears in your wallet</Text>
        </View>
      </InfoCard>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  title: {
    ...Theme.typo.title,
    color: Theme.colors.text,
  },
  subtitle: {
    marginTop: -4,
    ...Theme.typo.subtitle,
    color: Theme.colors.textMuted,
  },
  list: {
    gap: 6,
  },
  listItem: {
    fontSize: 13,
    color: Theme.colors.text,
    fontWeight: '600',
  },
});
