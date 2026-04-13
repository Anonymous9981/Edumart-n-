import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { ScreenShell, SkeletonBlock } from '../components/screen-shell';
import { useNativeStore } from '../lib/native-store';
import { useAppTheme } from '../theme/theme-provider';

export default function CartScreen() {
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const { loading, cartItemsDetailed, updateCartQuantity, removeFromCart, cartTotal } = useNativeStore();

  return (
    <ScreenShell>
      <View style={styles.header}>
        <Text style={styles.heading}>Cart</Text>
        <Text style={styles.total}>INR {Math.round(cartTotal)}</Text>
      </View>

      {loading
        ? Array.from({ length: 4 }).map((_, index) => (
            <View key={`cart-loading-${index}`} style={styles.itemCard}>
              <SkeletonBlock height={72} />
            </View>
          ))
        : cartItemsDetailed.map((item) => (
            <View key={item.productId} style={styles.itemCard}>
              <View style={styles.row}>
                <Image source={{ uri: item.product.image }} style={styles.thumb} />
                <View style={styles.content}>
                  <Text style={styles.title}>{item.product.title}</Text>
                  <Text style={styles.meta}>INR {Math.round(item.product.finalPrice)} each</Text>
                  <Text style={styles.subtotal}>INR {Math.round(item.subtotal)}</Text>
                </View>
              </View>
              <View style={styles.controls}>
                <Pressable
                  style={styles.qtyBtn}
                  onPress={() => updateCartQuantity(item.productId, Math.max(1, item.quantity - 1))}
                >
                  <Text style={styles.qtyText}>-</Text>
                </Pressable>
                <Text style={styles.qtyLabel}>{item.quantity}</Text>
                <Pressable style={styles.qtyBtn} onPress={() => updateCartQuantity(item.productId, item.quantity + 1)}>
                  <Text style={styles.qtyText}>+</Text>
                </Pressable>
                <Pressable style={styles.removeBtn} onPress={() => removeFromCart(item.productId)}>
                  <Text style={styles.removeText}>Remove</Text>
                </Pressable>
              </View>
            </View>
          ))}

      {!loading && cartItemsDetailed.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyHeading}>Cart is empty</Text>
          <Text style={styles.emptySub}>Add products from Shop to start checkout.</Text>
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
    total: {
      fontSize: 16,
      fontWeight: '900',
      color: theme.colors.accent,
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
      width: 72,
      height: 72,
      borderRadius: 10,
      backgroundColor: theme.colors.surfaceRaised,
    },
    content: {
      flex: 1,
      gap: 4,
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
    subtotal: {
      fontSize: 13,
      color: theme.colors.text,
      fontWeight: '800',
    },
    controls: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    qtyBtn: {
      width: 32,
      height: 32,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surfaceRaised,
      alignItems: 'center',
      justifyContent: 'center',
    },
    qtyText: {
      fontSize: 16,
      fontWeight: '900',
      color: theme.colors.text,
    },
    qtyLabel: {
      minWidth: 24,
      textAlign: 'center',
      fontSize: 14,
      fontWeight: '800',
      color: theme.colors.text,
    },
    removeBtn: {
      marginLeft: 'auto',
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 8,
      backgroundColor: theme.colors.surfaceRaised,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    removeText: {
      fontSize: 11,
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
