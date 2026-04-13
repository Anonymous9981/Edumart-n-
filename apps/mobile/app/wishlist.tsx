import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { ScreenShell, SkeletonBlock } from '../components/screen-shell';
import { useNativeStore } from '../lib/native-store';
import { useAppTheme } from '../theme/theme-provider';

export default function WishlistScreen() {
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const { loading, wishlistProducts, toggleWishlist, addToCart } = useNativeStore();

  return (
    <ScreenShell>
      <View style={styles.header}>
        <Text style={styles.heading}>Wishlist</Text>
        <Text style={styles.counter}>{wishlistProducts.length} saved</Text>
      </View>

      {loading
        ? Array.from({ length: 4 }).map((_, index) => (
            <View key={`wish-loading-${index}`} style={styles.itemCard}>
              <SkeletonBlock height={70} />
            </View>
          ))
        : wishlistProducts.map((product) => (
            <View key={product.id} style={styles.itemCard}>
              <View style={styles.row}>
                <Image source={{ uri: product.image }} style={styles.thumb} />
                <View style={styles.content}>
                  <Text style={styles.title}>{product.title}</Text>
                  <Text style={styles.meta}>{product.vendor}</Text>
                  <Text style={styles.price}>INR {Math.round(product.finalPrice)}</Text>
                </View>
              </View>
              <View style={styles.actions}>
                <Pressable style={styles.secondary} onPress={() => toggleWishlist(product.id)}>
                  <Text style={styles.secondaryText}>Remove</Text>
                </Pressable>
                <Pressable style={styles.primary} onPress={() => addToCart(product.id)}>
                  <Text style={styles.primaryText}>Add to Cart</Text>
                </Pressable>
              </View>
            </View>
          ))}

      {!loading && wishlistProducts.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyHeading}>No saved products</Text>
          <Text style={styles.emptySub}>Tap Wishlist on products from Home or Shop.</Text>
        </View>
      ) : null}
    </ScreenShell>
  );
}

const getStyles = (theme: ReturnType<typeof useAppTheme>['theme']) =>
  StyleSheet.create({
    header: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      padding: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      ...theme.shadows.neumorph,
    },
    heading: {
      fontSize: 22,
      fontWeight: '900',
      color: theme.colors.text,
    },
    counter: {
      fontSize: 12,
      fontWeight: '800',
      color: theme.colors.textMuted,
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
      width: 70,
      height: 70,
      borderRadius: 10,
      backgroundColor: theme.colors.surfaceRaised,
    },
    content: {
      flex: 1,
      gap: 3,
    },
    title: {
      fontSize: 14,
      color: theme.colors.text,
      fontWeight: '900',
    },
    meta: {
      fontSize: 11,
      color: theme.colors.textMuted,
      fontWeight: '700',
    },
    price: {
      fontSize: 14,
      color: theme.colors.accent,
      fontWeight: '900',
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
      color: theme.colors.text,
      fontWeight: '800',
    },
    emptyCard: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      padding: 16,
      gap: 6,
      ...theme.shadows.neumorph,
    },
    emptyHeading: {
      fontSize: 15,
      fontWeight: '900',
      color: theme.colors.text,
    },
    emptySub: {
      fontSize: 12,
      color: theme.colors.textMuted,
    },
  });
