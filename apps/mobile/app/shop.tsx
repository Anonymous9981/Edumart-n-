import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ScreenShell } from '../components/screen-shell';
import { AppButton } from '../components/ui/app-button';
import { InfoCard } from '../components/ui/info-card';
import { useMockStore } from '../lib/mock-store';
import { discountedPrice, formatInr } from '../lib/mock-utils';
import { useAppTheme } from '../theme/theme-provider';

export default function ShopScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const { products, categories, wishlistIds, addToCart, toggleWishlist } = useMockStore();
  const [activeCategory, setActiveCategory] = React.useState<(typeof categories)[number]>('All');

  const visibleProducts = React.useMemo(
    () => products.filter((product) => activeCategory === 'All' || product.category === activeCategory),
    [products, activeCategory],
  );

  return (
    <ScreenShell>
      <Text style={styles.title}>Shop</Text>
      <Text style={styles.subtitle}>Full mock catalog with working cart and wishlist actions.</Text>

      <View style={styles.filterRow}>
        {categories.map((label) => (
          <AppButton
            key={label}
            label={label}
            variant={activeCategory === label ? 'primary' : 'secondary'}
            onPress={() => setActiveCategory(label)}
          />
        ))}
      </View>

      <View style={styles.list}>
        {visibleProducts.map((item) => {
          const inWishlist = wishlistIds.includes(item.id);
          return (
            <InfoCard
              key={item.id}
              title={item.name}
              subtitle={`${item.category} • ${item.gradeBand} • ${item.rating.toFixed(1)}★ (${item.reviewCount})`}
            >
              <View style={styles.cardBadge}>
                <Text style={styles.cardBadgeText}>{item.badge ?? `${item.discountPercent}% off`}</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceNow}>{formatInr(discountedPrice(item.price, item.discountPercent))}</Text>
                <Text style={styles.priceOld}>{formatInr(item.price)}</Text>
              </View>
              <View style={styles.rowButtons}>
                <AppButton label="View" variant="secondary" onPress={() => router.push(`/shop/${item.id}` as never)} />
                <AppButton label="Add to cart" onPress={() => addToCart(item.id)} />
                <AppButton
                  label={inWishlist ? 'Saved' : 'Wishlist'}
                  variant="secondary"
                  icon={<Ionicons name={inWishlist ? 'heart' : 'heart-outline'} size={14} color={theme.colors.accent} />}
                  onPress={() => toggleWishlist(item.id)}
                />
              </View>
            </InfoCard>
          );
        })}
      </View>
    </ScreenShell>
  );
}

const getStyles = (theme: ReturnType<typeof useAppTheme>['theme']) =>
  StyleSheet.create({
    title: {
      fontSize: 24,
      fontWeight: '900',
      color: theme.colors.text,
    },
    subtitle: {
      fontSize: 13,
      color: theme.colors.textMuted,
    },
    filterRow: {
      marginTop: 6,
      flexDirection: 'row',
      gap: 8,
      flexWrap: 'wrap',
    },
    list: {
      gap: 10,
      marginTop: 8,
    },
    cardBadge: {
      alignSelf: 'flex-start',
      borderRadius: 999,
      backgroundColor: theme.colors.accentSoft,
      paddingHorizontal: 8,
      paddingVertical: 4,
      marginTop: 2,
    },
    cardBadgeText: {
      fontSize: 10,
      fontWeight: '700',
      color: theme.colors.accent,
      textTransform: 'uppercase',
    },
    priceRow: {
      marginTop: 6,
      flexDirection: 'row',
      gap: 8,
      alignItems: 'center',
    },
    priceNow: {
      fontSize: 15,
      fontWeight: '900',
      color: theme.colors.text,
    },
    priceOld: {
      fontSize: 12,
      textDecorationLine: 'line-through',
      color: theme.colors.textMuted,
    },
    rowButtons: {
      marginTop: 8,
      flexDirection: 'row',
      gap: 8,
      flexWrap: 'wrap',
    },
  });
