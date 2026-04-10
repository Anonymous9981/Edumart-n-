import { StyleSheet, Text, View } from 'react-native';

import { ScreenShell } from '../../components/screen-shell';
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
