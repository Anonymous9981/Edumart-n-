import { useMemo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ScreenShell, SkeletonBlock } from '../components/screen-shell';
import { InfoCard } from '../components/ui/info-card';
import { AppButton } from '../components/ui/app-button';
import { useNativeStore } from '../lib/native-store';
import { useAppTheme } from '../theme/theme-provider';

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const { loading, products, addToCart, updatedAt } = useNativeStore();
  const styles = getStyles(theme);

  const featured = useMemo(() => products.slice(0, 4), [products]);

  return (
    <ScreenShell>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>EduMart Mobile</Text>
        <Text style={styles.title}>Fast native shopping experience</Text>
        <Text style={styles.subtitle}>No browser shell. Live catalog data with lightweight loading states.</Text>
        <Text style={styles.syncNote}>Synced: {updatedAt ? new Date(updatedAt).toLocaleTimeString() : 'pending'}</Text>
        <View style={styles.heroActions}>
          <AppButton label="Open Shop" onPress={() => router.push('/shop')} />
        </View>
      </View>

      <InfoCard
        title="Quick Highlights"
        subtitle="Browse products, save wishlist picks, and manage cart instantly from native tabs."
      />

      {loading
        ? Array.from({ length: 3 }).map((_, index) => (
            <View key={`skeleton-${index}`} style={styles.productCard}>
              <SkeletonBlock height={140} />
              <SkeletonBlock height={14} />
              <SkeletonBlock height={14} />
            </View>
          ))
        : featured.map((product) => (
            <View key={product.id} style={styles.productCard}>
              <Image source={{ uri: product.image }} style={styles.productImage} />
              <Text style={styles.vendor}>{product.vendor}</Text>
              <Text style={styles.productTitle}>{product.title}</Text>
              <Text style={styles.productMeta}>{product.category}</Text>
              <View style={styles.priceRow}>
                <Text style={styles.price}>INR {Math.round(product.finalPrice)}</Text>
                <Text style={styles.mrp}>INR {Math.round(product.price)}</Text>
              </View>
              <View style={styles.cardActions}>
                <Pressable style={styles.secondaryButton} onPress={() => router.push('/shop')}>
                  <Text style={styles.secondaryLabel}>Details</Text>
                </Pressable>
                <Pressable style={styles.primaryButton} onPress={() => addToCart(product.id)}>
                  <Text style={styles.primaryLabel}>Add</Text>
                </Pressable>
              </View>
            </View>
          ))}
    </ScreenShell>
  );
}

const getStyles = (theme: ReturnType<typeof useAppTheme>['theme']) =>
  StyleSheet.create({
    hero: {
      borderRadius: 22,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.accent,
      padding: 16,
      gap: 8,
      ...theme.shadows.neumorph,
    },
    eyebrow: {
      fontSize: 10,
      fontWeight: '900',
      letterSpacing: 1,
      textTransform: 'uppercase',
      color: theme.isDark ? '#B9FCE9' : '#DFF5FF',
    },
    title: {
      ...theme.typo.title,
      color: '#F7FBFF',
      fontSize: 26,
    },
    subtitle: {
      ...theme.typo.subtitle,
      color: '#DFEAF7',
    },
    syncNote: {
      fontSize: 11,
      fontWeight: '700',
      color: '#D5FFF4',
    },
    heroActions: {
      marginTop: 4,
    },
    productCard: {
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      padding: 12,
      gap: 8,
      ...theme.shadows.neumorph,
    },
    productImage: {
      width: '100%',
      height: 160,
      borderRadius: 14,
      backgroundColor: theme.colors.surfaceRaised,
    },
    vendor: {
      fontSize: 10,
      fontWeight: '800',
      letterSpacing: 0.8,
      textTransform: 'uppercase',
      color: theme.colors.textMuted,
    },
    productTitle: {
      fontSize: 16,
      fontWeight: '900',
      color: theme.colors.text,
    },
    productMeta: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.colors.textMuted,
    },
    priceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    price: {
      fontSize: 16,
      fontWeight: '900',
      color: theme.colors.text,
    },
    mrp: {
      fontSize: 12,
      color: theme.colors.textMuted,
      textDecorationLine: 'line-through',
    },
    cardActions: {
      flexDirection: 'row',
      gap: 8,
    },
    primaryButton: {
      flex: 1,
      borderRadius: 12,
      backgroundColor: theme.colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
    },
    primaryLabel: {
      fontSize: 13,
      fontWeight: '900',
      color: theme.isDark ? '#06121E' : '#F8FBFF',
    },
    secondaryButton: {
      flex: 1,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      backgroundColor: theme.colors.surfaceRaised,
    },
    secondaryLabel: {
      fontSize: 13,
      fontWeight: '800',
      color: theme.colors.text,
    },
  });
