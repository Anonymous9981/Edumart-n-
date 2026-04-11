import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AnimatedEntry } from '../components/ui/animated-entry';
import { ScreenShell } from '../components/screen-shell';
import { AppButton } from '../components/ui/app-button';
import { InfoCard } from '../components/ui/info-card';
import { useMockStore } from '../lib/mock-store';
import { useAppTheme } from '../theme/theme-provider';

export default function OffersScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const { offers, audienceFilter, setAudienceFilter } = useMockStore();

  return (
    <ScreenShell>
      <AnimatedEntry>
        <View style={styles.heroCard}>
          <Text style={styles.title}>Offers</Text>
          <Text style={styles.subtitle}>Live mock campaigns with prime, referral, and bundle savings.</Text>
        </View>
      </AnimatedEntry>

      <AnimatedEntry delay={90}>
        <View style={styles.audienceRow}>
          <AppButton label="All" variant={audienceFilter === 'all' ? 'primary' : 'secondary'} onPress={() => setAudienceFilter('all')} />
          <AppButton label="Student" variant={audienceFilter === 'student' ? 'primary' : 'secondary'} onPress={() => setAudienceFilter('student')} />
          <AppButton label="School" variant={audienceFilter === 'school' ? 'primary' : 'secondary'} onPress={() => setAudienceFilter('school')} />
        </View>
      </AnimatedEntry>

      <AnimatedEntry delay={120}>
        <Text style={styles.audienceHint}>
          Showing {audienceFilter === 'all' ? 'all audience' : audienceFilter} offer recommendations.
        </Text>
      </AnimatedEntry>

      <View style={styles.list}>
        {offers.map((offer, index) => (
          <AnimatedEntry key={offer.id} delay={140 + index * 40}>
            <InfoCard title={offer.title} subtitle={offer.subtitle}>
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
          </AnimatedEntry>
        ))}
      </View>
    </ScreenShell>
  );
}

const getStyles = (theme: ReturnType<typeof useAppTheme>['theme']) =>
  StyleSheet.create({
    title: {
      fontSize: 26,
      fontWeight: '900',
      color: '#F8FBFF',
    },
    subtitle: {
      marginTop: 2,
      ...theme.typo.subtitle,
      color: '#D8E7F7',
    },
    heroCard: {
      borderRadius: 24,
      backgroundColor: theme.colors.accent,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: 16,
    },
    audienceRow: {
      flexDirection: 'row',
      gap: 8,
      flexWrap: 'wrap',
      marginTop: 4,
    },
    audienceHint: {
      fontSize: 12,
      color: theme.colors.textMuted,
      marginTop: -4,
      marginBottom: 2,
    },
    list: {
      gap: 10,
    },
  });
