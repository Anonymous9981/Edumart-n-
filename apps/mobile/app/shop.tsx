import { useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ScreenShell, SkeletonBlock } from '../components/screen-shell';
import { useNativeStore } from '../lib/native-store';
import { useAppTheme } from '../theme/theme-provider';

export default function ShopScreen() {
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const { loading, products, addToCart, toggleWishlist, wishlist, updatedAt } = useNativeStore();
  const [query, setQuery] = useState('');

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return products;
    }
    return products.filter((product) =>
      `${product.title} ${product.category} ${product.vendor}`.toLowerCase().includes(q),
    );
  }, [products, query]);

  return (
    <ScreenShell>
      <View style={styles.headerCard}>
        <Text style={styles.heading}>Shop</Text>
        <Text style={styles.subheading}>Native list rendering for faster browsing.</Text>
        <Text style={styles.syncNote}>Live sync: {updatedAt ? new Date(updatedAt).toLocaleTimeString() : 'pending'}</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search products"
          placeholderTextColor={theme.colors.textMuted}
          style={styles.searchInput}
        />
      </View>

      {loading
        ? Array.from({ length: 5 }).map((_, index) => (
            <View key={`loading-${index}`} style={styles.itemCard}>
              <SkeletonBlock height={80} />
              <SkeletonBlock height={14} />
            </View>
          ))
        : visible.map((product) => {
            const saved = wishlist.includes(product.id);
            return (
              <View key={product.id} style={styles.itemCard}>
                <View style={styles.row}>
                  <Image source={{ uri: product.image }} style={styles.thumb} />
                  <View style={styles.content}>
                    <Text style={styles.title}>{product.title}</Text>
                    <Text style={styles.meta}>{product.vendor}</Text>
                    <Text style={styles.meta}>{product.category}</Text>
                    <View style={styles.priceRow}>
                      <Text style={styles.price}>INR {Math.round(product.finalPrice)}</Text>
                      <Text style={styles.cut}>INR {Math.round(product.price)}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.actions}>
                  <Pressable style={styles.secondary} onPress={() => toggleWishlist(product.id)}>
                    <Text style={styles.secondaryText}>{saved ? 'Saved' : 'Wishlist'}</Text>
                  </Pressable>
                  <Pressable style={styles.primary} onPress={() => addToCart(product.id)}>
                    <Text style={styles.primaryText}>Add to Cart</Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
    </ScreenShell>
  );
}

const getStyles = (theme: ReturnType<typeof useAppTheme>['theme']) =>
  StyleSheet.create({
    headerCard: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      padding: 12,
      gap: 8,
      ...theme.shadows.neumorph,
    },
    heading: {
      fontSize: 22,
      fontWeight: '900',
      color: theme.colors.text,
    },
    subheading: {
      fontSize: 12,
      color: theme.colors.textMuted,
    },
    syncNote: {
      fontSize: 11,
      color: theme.colors.textMuted,
      fontWeight: '700',
    },
    searchInput: {
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surfaceRaised,
      paddingHorizontal: 12,
      paddingVertical: 10,
      color: theme.colors.text,
      fontSize: 13,
      fontWeight: '600',
    },
    itemCard: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      padding: 10,
      gap: 10,
      ...theme.shadows.neumorph,
    },
    row: {
      flexDirection: 'row',
      gap: 10,
    },
    thumb: {
      width: 88,
      height: 88,
      borderRadius: 12,
      backgroundColor: theme.colors.surfaceRaised,
    },
    content: {
      flex: 1,
      gap: 3,
    },
    title: {
      fontSize: 14,
      fontWeight: '900',
      color: theme.colors.text,
    },
    meta: {
      fontSize: 11,
      color: theme.colors.textMuted,
      fontWeight: '700',
    },
    priceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 2,
    },
    price: {
      fontSize: 14,
      fontWeight: '900',
      color: theme.colors.text,
    },
    cut: {
      fontSize: 11,
      color: theme.colors.textMuted,
      textDecorationLine: 'line-through',
    },
    actions: {
      flexDirection: 'row',
      gap: 8,
    },
    primary: {
      flex: 1,
      borderRadius: 12,
      backgroundColor: theme.colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
    },
    primaryText: {
      fontSize: 12,
      fontWeight: '900',
      color: theme.isDark ? '#04121D' : '#F7FBFF',
    },
    secondary: {
      flex: 1,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surfaceRaised,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
    },
    secondaryText: {
      fontSize: 12,
      fontWeight: '800',
      color: theme.colors.text,
    },
  });
