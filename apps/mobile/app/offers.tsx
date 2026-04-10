import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ScreenShell } from '../components/screen-shell';
import { AppButton } from '../components/ui/app-button';
import { InfoCard } from '../components/ui/info-card';
import { useMockStore } from '../lib/mock-store';
import { useAppTheme } from '../theme/theme-provider';

export default function OffersScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const { offers } = useMockStore();

  return (
    <ScreenShell>
      <Text style={styles.title}>Offers</Text>
      <Text style={styles.subtitle}>Live mock campaigns with prime, referral, and bundle savings.</Text>

      {offers.map((offer) => (
        <InfoCard key={offer.id} title={offer.title} subtitle={offer.subtitle}>
          <AppButton
            label={offer.cta}
            onPress={() => {
              if (offer.id === 'offer-prime') {
                router.push('/offers/prime' as never);
                return;
              }

              if (offer.id === 'offer-refer') {
                router.push('/offers/refer' as never);
                return;
              }

              router.push('/shop' as never);
            }}
          />
        </InfoCard>
      ))}
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
  });
