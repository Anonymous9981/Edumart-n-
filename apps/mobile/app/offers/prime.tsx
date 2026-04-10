import { StyleSheet, Text, View } from 'react-native';

import { ScreenShell } from '../../components/screen-shell';
import { useAppTheme } from '../../theme/theme-provider';
import { InfoCard } from '../../components/ui/info-card';

export default function PrimeOfferScreen() {
  const { theme } = useAppTheme();
  const styles = getStyles(theme);

  return (
    <ScreenShell>
      <Text style={styles.title}>Prime Membership</Text>
      <Text style={styles.subtitle}>Premium plan for frequent school and student purchases.</Text>

      <InfoCard title="₹199 / month" subtitle="Includes member perks for family and institutional orders.">
        <View style={styles.list}>
          <Text style={styles.listItem}>• 4 free deliveries every month</Text>
          <Text style={styles.listItem}>• Early access to promo campaigns</Text>
          <Text style={styles.listItem}>• Priority support queue</Text>
          <Text style={styles.listItem}>• Prime-only bundle discounts up to 25%</Text>
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
