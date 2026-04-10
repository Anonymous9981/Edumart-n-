import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ScreenShell } from '../components/screen-shell';
import { useMockStore } from '../lib/mock-store';
import { discountedPrice, formatInr } from '../lib/mock-utils';
import { useAppTheme } from '../theme/theme-provider';

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const { products, cartCount, wishlistCount, addToCart, toggleWishlist, wishlistIds } = useMockStore();

  const featured = products.slice(0, 3);

  return (
    <ScreenShell>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>EDUMART</Text>
          <Text style={styles.subtitle}>Real mock store for school shopping</Text>
        </View>
        <View style={styles.headerIcons}>
          <Pressable style={styles.iconButton} onPress={() => router.push('/wishlist' as never)}>
            <Ionicons name="heart-outline" color={theme.colors.accent} size={20} />
          </Pressable>
          <Pressable style={styles.iconButton} onPress={() => router.push('/cart' as never)}>
            <Ionicons name="cart-outline" color={theme.colors.accent} size={20} />
          </Pressable>
        </View>
      </View>

      <View style={styles.kpiRow}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiValue}>{products.length}</Text>
          <Text style={styles.kpiLabel}>Products</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiValue}>{wishlistCount}</Text>
          <Text style={styles.kpiLabel}>Wishlist</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiValue}>{cartCount}</Text>
          <Text style={styles.kpiLabel}>In Cart</Text>
        </View>
      </View>

      <View style={styles.heroCard}>
        <View style={styles.brandMark}>
          <Text style={styles.brandMarkText}>ED</Text>
        </View>
        <Text style={styles.heroBadge}>Edition 2026</Text>
        <Text style={styles.heroTitle}>Complete mock marketplace with real interactions</Text>
        <Text style={styles.heroText}>Browse category products, wishlist favorites, cart totals, offers and account utilities with live mock state.</Text>
        <Pressable style={styles.primaryButton} onPress={() => router.push('/shop' as never)}>
          <Text style={styles.primaryButtonText}>Explore products</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Featured right now</Text>
      <View style={styles.list}>
        {featured.map((product) => {
          const inWishlist = wishlistIds.includes(product.id);

          return (
            <View key={product.id} style={styles.productCard}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productSubtitle}>{product.subtitle}</Text>
              <View style={styles.priceRow}>
                <Text style={styles.priceNow}>{formatInr(discountedPrice(product.price, product.discountPercent))}</Text>
                <Text style={styles.priceOld}>{formatInr(product.price)}</Text>
              </View>
              <View style={styles.actionRow}>
                <Pressable style={styles.ctaGhost} onPress={() => toggleWishlist(product.id)}>
                  <Ionicons name={inWishlist ? 'heart' : 'heart-outline'} color={theme.colors.accent} size={16} />
                  <Text style={styles.ctaGhostText}>{inWishlist ? 'Saved' : 'Save'}</Text>
                </Pressable>
                <Pressable style={styles.ctaSolid} onPress={() => addToCart(product.id)}>
                  <Text style={styles.ctaSolidText}>Add to cart</Text>
                </Pressable>
                <Pressable style={styles.ctaGhost} onPress={() => router.push(`/shop/${product.id}` as never)}>
                  <Text style={styles.ctaGhostText}>View</Text>
                </Pressable>
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.quickGrid}>
        <Pressable style={styles.quickCard} onPress={() => router.push('/shop' as never)}>
          <Ionicons name="bag-handle-outline" color={theme.colors.accent} size={20} />
          <Text style={styles.quickTitle}>Shop</Text>
        </Pressable>
        <Pressable style={styles.quickCard} onPress={() => router.push('/offers' as never)}>
          <Ionicons name="pricetag-outline" color={theme.colors.accent} size={20} />
          <Text style={styles.quickTitle}>Offers</Text>
        </Pressable>
      </View>
    </ScreenShell>
  );
}

const getStyles = (theme: ReturnType<typeof useAppTheme>['theme']) =>
  StyleSheet.create({
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    },
    headerIcons: {
      flexDirection: 'row',
      gap: 10,
    },
    iconButton: {
      width: 42,
      height: 42,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 28,
      fontWeight: '900',
      color: theme.colors.text,
      letterSpacing: 0.4,
    },
    subtitle: {
      fontSize: 12,
      color: theme.colors.textMuted,
      marginTop: 2,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    kpiRow: {
      flexDirection: 'row',
      gap: 8,
    },
    kpiCard: {
      flex: 1,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      paddingVertical: 10,
      alignItems: 'center',
    },
    kpiValue: {
      fontSize: 20,
      fontWeight: '900',
      color: theme.colors.text,
    },
    kpiLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: theme.colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.7,
    },
    heroCard: {
      borderRadius: 22,
      padding: 18,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: 6,
    },
    brandMark: {
      alignSelf: 'flex-start',
      width: 46,
      height: 46,
      borderRadius: 999,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.accent,
    },
    brandMarkText: {
      color: theme.isDark ? '#11131B' : '#F6F8FF',
      fontSize: 17,
      fontWeight: '900',
      letterSpacing: 0.8,
    },
    heroBadge: {
      alignSelf: 'flex-start',
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 4,
      backgroundColor: theme.colors.accentSoft,
      color: theme.colors.accent,
      fontSize: 10,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.6,
      marginTop: 4,
    },
    heroTitle: {
      marginTop: 8,
      color: theme.colors.text,
      fontSize: 22,
      fontWeight: '800',
      lineHeight: 28,
    },
    heroText: {
      marginTop: 4,
      color: theme.colors.textMuted,
      fontSize: 14,
      lineHeight: 21,
    },
    primaryButton: {
      marginTop: 10,
      backgroundColor: theme.colors.accent,
      borderRadius: 12,
      alignItems: 'center',
      paddingVertical: 12,
    },
    primaryButtonText: {
      color: theme.isDark ? '#11131B' : '#E9EFFA',
      fontSize: 15,
      fontWeight: '700',
    },
    sectionTitle: {
      fontSize: 17,
      fontWeight: '900',
      color: theme.colors.text,
      marginTop: 2,
    },
    list: {
      gap: 10,
    },
    productCard: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      padding: 14,
      gap: 4,
    },
    productName: {
      fontSize: 15,
      fontWeight: '800',
      color: theme.colors.text,
    },
    productSubtitle: {
      fontSize: 12,
      color: theme.colors.textMuted,
    },
    priceRow: {
      marginTop: 2,
      flexDirection: 'row',
      gap: 8,
      alignItems: 'center',
    },
    priceNow: {
      fontSize: 14,
      fontWeight: '800',
      color: theme.colors.text,
    },
    priceOld: {
      fontSize: 12,
      textDecorationLine: 'line-through',
      color: theme.colors.textMuted,
    },
    actionRow: {
      marginTop: 8,
      flexDirection: 'row',
      gap: 8,
      alignItems: 'center',
    },
    ctaGhost: {
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surfaceRaised,
      paddingHorizontal: 10,
      paddingVertical: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    ctaGhostText: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.colors.text,
    },
    ctaSolid: {
      borderRadius: 10,
      backgroundColor: theme.colors.accentSoft,
      borderWidth: 1,
      borderColor: theme.colors.accent,
      paddingHorizontal: 11,
      paddingVertical: 8,
    },
    ctaSolidText: {
      fontSize: 12,
      fontWeight: '800',
      color: theme.colors.accent,
    },
    quickGrid: {
      flexDirection: 'row',
      gap: 10,
    },
    quickCard: {
      flex: 1,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      gap: 8,
    },
    quickTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.colors.text,
    },
  });
