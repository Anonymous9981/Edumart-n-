import { StyleSheet, Text, View } from 'react-native';

import { ScreenShell } from '../../components/screen-shell';
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
    fontSize: 30,
    fontWeight: '900',
    color: '#0B3558',
  },
  subtitle: {
    marginTop: -4,
    fontSize: 13,
    lineHeight: 20,
    color: '#45627f',
  },
  list: {
    gap: 6,
  },
  listItem: {
    fontSize: 13,
    color: '#244661',
    fontWeight: '600',
  },
});
