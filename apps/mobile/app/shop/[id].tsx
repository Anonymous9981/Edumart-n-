import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ScreenShell } from '../../components/screen-shell';
import { Theme } from '../../theme/tokens';
import { AppButton } from '../../components/ui/app-button';
import { InfoCard } from '../../components/ui/info-card';

export default function ProductDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = params.id ?? 'product';

  return (
    <ScreenShell>
      <Text style={styles.title}>Product Details</Text>
      <Text style={styles.subtitle}>Subpage for richer product browsing experience.</Text>

      <InfoCard title={`Product #${id}`} subtitle="Detailed info, pricing, and purchase options will appear here.">
        <View style={styles.metaRow}>
          <Text style={styles.meta}>Rating: 4.7</Text>
          <Text style={styles.meta}>Stock: Available</Text>
        </View>
        <AppButton label="Add to cart" onPress={() => {}} />
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
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  meta: {
    fontSize: 12,
    color: Theme.colors.textMuted,
    fontWeight: '700',
  },
});
