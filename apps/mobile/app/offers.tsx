import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ScreenShell } from '../components/screen-shell';
import { Theme } from '../theme/tokens';
import { AppButton } from '../components/ui/app-button';
import { InfoCard } from '../components/ui/info-card';

export default function OffersScreen() {
  const router = useRouter();

  return (
    <ScreenShell>
      <Text style={styles.title}>Offers</Text>
      <Text style={styles.subtitle}>Prime membership, referrals and active savings.</Text>

      <InfoCard title="Prime Membership" subtitle="Get free deliveries and priority support for monthly plans.">
        <AppButton label="View Prime" onPress={() => router.push('/offers/prime' as never)} />
      </InfoCard>

      <InfoCard title="Refer to Earn" subtitle="Invite friends and earn wallet rewards after successful orders.">
        <AppButton label="View Referral Program" variant="secondary" onPress={() => router.push('/offers/refer' as never)} />
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
});
