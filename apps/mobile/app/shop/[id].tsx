import { useLocalSearchParams } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';

import { ScreenShell } from '../../components/screen-shell';
import { AppButton } from '../../components/ui/app-button';
import { InfoCard } from '../../components/ui/info-card';
import { useMockStore } from '../../lib/mock-store';
import { discountedPrice, formatInr } from '../../lib/mock-utils';
import { useAppTheme } from '../../theme/theme-provider';

export default function ProductDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = params.id ?? 'product';
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const { products, addToCart, toggleWishlist, wishlistIds } = useMockStore();
  const product = products.find((item) => item.id === id) ?? products[0];
  const finalPrice = discountedPrice(product.price, product.discountPercent);
  const inWishlist = wishlistIds.includes(product.id);

  return (
    <ScreenShell>
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.subtitle}>{product.subtitle}</Text>

      <Image source={{ uri: product.image }} style={styles.heroImage} resizeMode="cover" />

      <InfoCard title={`${product.subcategory ?? product.category} • ${product.gradeBand}`} subtitle={product.description}>
        <View style={styles.metaRow}>
          <Text style={styles.meta}>Rating: {product.rating.toFixed(1)} ★ ({product.reviewCount})</Text>
          <Text style={styles.meta}>Stock: {product.stock}</Text>
        </View>
        <Text style={styles.audience}>Audience: {product.audience === 'school' ? 'School' : 'Student'}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.priceNow}>{formatInr(finalPrice)}</Text>
          <Text style={styles.priceOld}>{formatInr(product.price)}</Text>
          <Text style={styles.discount}>{product.discountPercent}% off</Text>
        </View>
        <View style={styles.actionRow}>
          <AppButton label="Add to cart" onPress={() => addToCart(product.id)} />
          <AppButton label={inWishlist ? 'Saved' : 'Wishlist'} variant="secondary" onPress={() => toggleWishlist(product.id)} />
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
    metaRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 8,
    },
    heroImage: {
      width: '100%',
      height: 220,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.bgSoft,
      marginTop: 2,
    },
    meta: {
      fontSize: 12,
      color: theme.colors.textMuted,
      fontWeight: '700',
      flex: 1,
    },
    audience: {
      marginTop: 4,
      fontSize: 12,
      fontWeight: '700',
      color: theme.colors.accent,
      textTransform: 'uppercase',
      letterSpacing: 0.4,
    },
    priceRow: {
      marginTop: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap',
    },
    priceNow: {
      fontSize: 16,
      color: theme.colors.text,
      fontWeight: '900',
    },
    priceOld: {
      fontSize: 13,
      color: theme.colors.textMuted,
      textDecorationLine: 'line-through',
    },
    discount: {
      fontSize: 11,
      color: theme.colors.success,
      fontWeight: '800',
      textTransform: 'uppercase',
      letterSpacing: 0.4,
    },
    actionRow: {
      marginTop: 10,
      flexDirection: 'row',
      gap: 8,
      flexWrap: 'wrap',
    },
  });
