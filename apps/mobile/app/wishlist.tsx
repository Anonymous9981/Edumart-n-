import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { ScreenShell } from '../components/screen-shell';
import { AppButton } from '../components/ui/app-button';
import { InfoCard } from '../components/ui/info-card';
import { useMockStore } from '../lib/mock-store';
import { discountedPrice, formatInr } from '../lib/mock-utils';
import { useAppTheme } from '../theme/theme-provider';

export default function WishlistScreen() {
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const { products, wishlistIds, addToCart, toggleWishlist } = useMockStore();

  const wishlistProducts = React.useMemo(
    () => products.filter((product) => wishlistIds.includes(product.id)),
    [products, wishlistIds],
  );

  return (
    <ScreenShell>
      <Text style={styles.title}>Wishlist</Text>
      <Text style={styles.subtitle}>Saved picks you can move to cart instantly.</Text>

      {wishlistProducts.length ? (
        wishlistProducts.map((product) => (
          <InfoCard key={product.id} title={product.name} subtitle={`${product.category} • ${product.gradeBand}`}>
            <Image source={{ uri: product.image }} style={styles.productImage} resizeMode="cover" />
            <Text style={styles.price}>{formatInr(discountedPrice(product.price, product.discountPercent))}</Text>
            <View style={styles.row}>
              <AppButton label="Move to cart" onPress={() => addToCart(product.id)} />
              <AppButton label="Remove" variant="secondary" onPress={() => toggleWishlist(product.id)} />
            </View>
          </InfoCard>
        ))
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>ED</Text>
          <Text style={styles.emptyTitle}>No items saved yet</Text>
          <Text style={styles.emptyText}>Use the wishlist action from Home or Shop to save products.</Text>
        </View>
      )}
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
    price: {
      fontSize: 14,
      fontWeight: '900',
      color: theme.colors.text,
      marginTop: 2,
    },
    productImage: {
      width: '100%',
      height: 120,
      borderRadius: 12,
      backgroundColor: theme.colors.bgSoft,
      marginTop: 2,
    },
    row: {
      flexDirection: 'row',
      gap: 8,
      flexWrap: 'wrap',
      marginTop: 8,
    },
    emptyCard: {
      marginTop: 14,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      paddingHorizontal: 18,
      paddingVertical: 26,
      gap: 6,
    },
    emptyIcon: {
      fontSize: 24,
      fontWeight: '900',
      color: theme.colors.accent,
    },
    emptyTitle: {
      fontSize: 16,
      fontWeight: '800',
      color: theme.colors.text,
    },
    emptyText: {
      fontSize: 13,
      color: theme.colors.textMuted,
      textAlign: 'center',
      lineHeight: 20,
    },
  });
