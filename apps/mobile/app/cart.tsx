import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { AnimatedEntry } from '../components/ui/animated-entry';
import { ScreenShell } from '../components/screen-shell';
import { AppButton } from '../components/ui/app-button';
import { InfoCard } from '../components/ui/info-card';
import { useMockStore } from '../lib/mock-store';
import { discountedPrice, formatInr } from '../lib/mock-utils';
import { useAppTheme } from '../theme/theme-provider';

export default function CartScreen() {
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const { cart, products, cartSubtotal, cartDiscount, cartTotal, decrementFromCart, addToCart, removeFromCart, clearCart } = useMockStore();

  const items = React.useMemo(
    () =>
      Object.entries(cart)
        .map(([id, qty]) => {
          const product = products.find((item) => item.id === id);
          if (!product) {
            return null;
          }
          return { product, qty };
        })
        .filter(Boolean) as Array<{ product: (typeof products)[number]; qty: number }>,
    [cart, products],
  );

  return (
    <ScreenShell>
      <AnimatedEntry>
        <View style={styles.heroCard}>
          <Text style={styles.title}>Cart</Text>
          <Text style={styles.subtitle}>Working cart with quantity controls and live totals.</Text>
        </View>
      </AnimatedEntry>

      <View style={styles.list}>
        {items.map(({ product, qty }, index) => {
          const unitPrice = discountedPrice(product.price, product.discountPercent);

          return (
            <AnimatedEntry key={product.id} delay={80 + index * 40}>
              <InfoCard title={product.name} subtitle={`${product.category} • ${formatInr(unitPrice)} each`}>
                <Image source={{ uri: product.image }} style={styles.itemImage} resizeMode="cover" />
                <View style={styles.itemRow}>
                  <View style={styles.qtyRow}>
                    <AppButton label="-" variant="secondary" onPress={() => decrementFromCart(product.id)} />
                    <Text style={styles.qtyText}>{qty}</Text>
                    <AppButton label="+" variant="secondary" onPress={() => addToCart(product.id)} />
                  </View>
                  <Text style={styles.itemTotal}>{formatInr(unitPrice * qty)}</Text>
                </View>
                <AppButton label="Remove" variant="secondary" onPress={() => removeFromCart(product.id)} />
              </InfoCard>
            </AnimatedEntry>
          );
        })}
      </View>

      <AnimatedEntry delay={160}>
        <View style={styles.summaryCard}>
        <View style={styles.summaryRow}><Text style={styles.summaryLine}>Items</Text><Text style={styles.summaryLine}>{items.length}</Text></View>
        <View style={styles.summaryRow}><Text style={styles.summaryLine}>Subtotal</Text><Text style={styles.summaryLine}>{formatInr(cartSubtotal)}</Text></View>
        <View style={styles.summaryRow}><Text style={styles.summaryLine}>Savings</Text><Text style={styles.free}>{formatInr(cartDiscount)}</Text></View>
        <View style={styles.summaryRow}><Text style={styles.summaryLine}>Delivery</Text><Text style={styles.free}>Free</Text></View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}><Text style={styles.totalLine}>Total</Text><Text style={styles.totalLine}>{formatInr(cartTotal)}</Text></View>
        <View style={styles.actionsRow}>
          <AppButton label="Clear cart" variant="secondary" onPress={clearCart} />
          <AppButton label="Proceed to checkout" onPress={() => {}} />
        </View>
        </View>
      </AnimatedEntry>
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
      fontSize: 13,
      color: '#D8E7F7',
    },
    heroCard: {
      borderRadius: 24,
      backgroundColor: theme.colors.accent,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: 16,
    },
    list: {
      gap: 10,
    },
    itemRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 6,
    },
    itemImage: {
      width: '100%',
      height: 110,
      borderRadius: 12,
      backgroundColor: theme.colors.bgSoft,
      marginTop: 2,
    },
    qtyRow: {
      flexDirection: 'row',
      gap: 8,
      alignItems: 'center',
    },
    qtyText: {
      fontSize: 15,
      fontWeight: '800',
      color: theme.colors.text,
      minWidth: 20,
      textAlign: 'center',
    },
    itemTotal: {
      fontSize: 14,
      fontWeight: '800',
      color: theme.colors.text,
    },
    summaryCard: {
      marginTop: 4,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      padding: 16,
      gap: 10,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    summaryDivider: {
      marginTop: 2,
      height: 1,
      backgroundColor: theme.colors.border,
    },
    summaryLine: {
      fontSize: 14,
      color: theme.colors.textMuted,
    },
    free: {
      color: theme.colors.success,
      fontWeight: '700',
    },
    totalLine: {
      fontSize: 16,
      fontWeight: '800',
      color: theme.colors.text,
    },
    actionsRow: {
      flexDirection: 'row',
      gap: 8,
      flexWrap: 'wrap',
      marginTop: 8,
    },
  });
