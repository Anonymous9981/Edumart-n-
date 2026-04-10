import { StyleSheet, Text, View } from 'react-native';

import { ScreenShell } from '../../components/screen-shell';
import { Theme } from '../../theme/tokens';
import { InfoCard } from '../../components/ui/info-card';

export default function PrimeOfferScreen() {
  return (
    <ScreenShell>
      <Text style={styles.title}>Prime Membership</Text>
      <Text style={styles.subtitle}>A monthly bundle for frequent EduMart shoppers.</Text>

      <InfoCard title="₹199 / month" subtitle="Includes member perks for family and institutional orders.">
        <View style={styles.list}>
          <Text style={styles.listItem}>• 4 free deliveries every month</Text>
          <Text style={styles.listItem}>• Early access to promo campaigns</Text>
          <Text style={styles.listItem}>• Priority support queue</Text>
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
