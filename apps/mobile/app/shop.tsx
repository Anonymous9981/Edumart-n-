import React from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ScreenShell, SkeletonBlock } from '../components/screen-shell';
import { Theme } from '../theme/tokens';
import { AppButton } from '../components/ui/app-button';
import { InfoCard } from '../components/ui/info-card';

const SAMPLE_PRODUCTS = [
  { id: 'p1', name: 'Smart Study Lamp', price: 'INR 1,299' },
  { id: 'p2', name: 'School Geometry Box', price: 'INR 249' },
  { id: 'p3', name: 'Teacher Planner Pro', price: 'INR 599' },
];

export default function ShopScreen() {
  const router = useRouter();

  return (
    <ScreenShell>
        <Text style={styles.title}>Shop</Text>
        <Text style={styles.subtitle}>Browse curated products for students and schools.</Text>

        <View style={styles.filterRow}>
          {['All', 'Books', 'Stationery', 'Tech'].map((label, index) => (
            <TouchableOpacity key={label} style={[styles.filterChip, index === 0 ? styles.filterChipActive : null]}>
              <Text style={[styles.filterChipText, index === 0 ? styles.filterChipTextActive : null]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.list}>
          {SAMPLE_PRODUCTS.map((item) => (
            <InfoCard key={item.id} title={item.name} subtitle={`Price: ${item.price}`}>
              <View style={styles.cardBadge}>
                <Text style={styles.cardBadgeText}>Top pick</Text>
              </View>
              <View style={styles.rowButtons}>
                <AppButton label="View" variant="secondary" onPress={() => router.push(`/shop/${item.id}` as never)} />
                <AppButton label="Add to cart" onPress={() => {}} />
              </View>
            </InfoCard>
          ))}
        </View>

        <View style={styles.skeletonCard}>
          <SkeletonBlock height={14} />
          <SkeletonBlock height={14} />
          <SkeletonBlock height={14} />
        </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: Theme.colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: Theme.colors.textMuted,
  },
  filterRow: {
    marginTop: 6,
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  filterChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    backgroundColor: Theme.colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  filterChipActive: {
    backgroundColor: Theme.colors.accentSoft,
    borderColor: Theme.colors.accent,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.colors.textMuted,
  },
  filterChipTextActive: {
    color: Theme.colors.accent,
  },
  list: {
    gap: 10,
    marginTop: 8,
  },
  cardBadge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: Theme.colors.accentSoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  cardBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Theme.colors.accent,
    textTransform: 'uppercase',
  },
  rowButtons: {
    marginTop: 4,
    flexDirection: 'row',
    gap: 8,
  },
  skeletonCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    backgroundColor: Theme.colors.surfaceRaised,
    padding: 12,
    gap: 8,
  },
});
