import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ScreenShell } from '../components/screen-shell';
import { AnimatedEntry } from '../components/ui/animated-entry';
import { useMockStore } from '../lib/mock-store';
import { discountedPrice, formatInr } from '../lib/mock-utils';
import { useAppTheme } from '../theme/theme-provider';

const quickNav = [
  { label: 'Shop', icon: 'bag-handle-outline', route: '/shop' },
  { label: 'Offers', icon: 'pricetag-outline', route: '/offers' },
  { label: 'Wishlist', icon: 'heart-outline', route: '/wishlist' },
  { label: 'Account', icon: 'person-outline', route: '/account' },
] as const;

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const {
    products,
    categoryTree,
    cartCount,
    wishlistCount,
    addToCart,
    toggleWishlist,
    wishlistIds,
    audienceFilter,
    setAudienceFilter,
    contentSource,
  } = useMockStore();

  const heroProduct = React.useMemo(
    () => products.find((product) => product.featured && product.audience === audienceFilter) ?? products[0],
    [products, audienceFilter],
  );

  const featured = React.useMemo(
    () => products.filter((product) => product.audience === audienceFilter).slice(0, 6),
    [products, audienceFilter],
  );

  const topCategories = React.useMemo(() => categoryTree.slice(0, 4), [categoryTree]);

  return (
    <ScreenShell>
      <AnimatedEntry style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <View style={styles.brandMark}>
            <Text style={styles.brandMarkText}>E</Text>
          </View>
          <View style={styles.heroBadgeWrap}>
            <Text style={styles.heroBadge}>EduMart marketplace</Text>
            <Text style={styles.heroMeta}>Website-first catalog sync</Text>
          </View>
        </View>

        <Text style={styles.heroTitle}>Products first. Categories second. Fast buying flow.</Text>
        <Text style={styles.heroText}>
          A cleaner shopping view with the same EduMart colors, cards, and category structure from the web experience.
        </Text>

        <View style={styles.spotlightCard}>
          <Image source={{ uri: heroProduct?.image ?? products[0]?.image }} style={styles.spotlightImage} resizeMode="cover" />
          <View style={styles.spotlightTextWrap}>
            <Text style={styles.spotlightLabel}>Featured now</Text>
            <Text style={styles.spotlightTitle}>{heroProduct?.name ?? 'EduMart selection'}</Text>
            <Text style={styles.spotlightMeta}>{heroProduct?.subcategory ?? heroProduct?.category ?? 'Top product'}</Text>
          </View>
        </View>

        <View style={styles.heroStatsRow}>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>{products.length}</Text>
            <Text style={styles.heroStatLabel}>Products</Text>
          </View>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>{wishlistCount}</Text>
            <Text style={styles.heroStatLabel}>Saved</Text>
          </View>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>{cartCount}</Text>
            <Text style={styles.heroStatLabel}>Cart</Text>
          </View>
        </View>

        <View style={styles.heroActions}>
          <Pressable style={styles.primaryButton} onPress={() => router.push('/shop' as never)}>
            <Text style={styles.primaryButtonText}>Browse products</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => router.push('/offers' as never)}>
            <Text style={styles.secondaryButtonText}>View offers</Text>
          </Pressable>
        </View>

        <Text style={styles.syncLabel}>Content source: {contentSource === 'website' ? 'Website API sync' : 'Fallback local data'}</Text>
      </AnimatedEntry>

      <AnimatedEntry delay={90}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Browse by audience</Text>
          <Text style={styles.sectionSubtitle}>Switch between student and school products.</Text>
        </View>
        <View style={styles.pillRow}>
          {[
            { key: 'all', label: 'All' },
            { key: 'student', label: 'Student' },
            { key: 'school', label: 'School' },
          ].map((item) => (
            <Pressable
              key={item.key}
              style={[styles.pill, audienceFilter === item.key ? styles.pillActive : null]}
              onPress={() => setAudienceFilter(item.key as 'all' | 'student' | 'school')}
            >
              <Text style={[styles.pillText, audienceFilter === item.key ? styles.pillTextActive : null]}>{item.label}</Text>
            </Pressable>
          ))}
        </View>
      </AnimatedEntry>

      <AnimatedEntry delay={140}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top categories</Text>
          <Text style={styles.sectionSubtitle}>Jump into categories and subcategories from the homepage.</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRail}>
          {topCategories.map((category) => (
            <Pressable
              key={category.name}
              style={styles.categoryCard}
              onPress={() => router.push(`/shop?category=${encodeURIComponent(category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}` as never)}
            >
              <View style={styles.categoryCardTop}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryCount}>{category.subcategories.length} subcategories</Text>
              </View>
              <View style={styles.subcategoryWrap}>
                {category.subcategories.slice(0, 3).map((sub) => (
                  <Text key={sub} style={styles.subcategoryChip}>
                    {sub}
                  </Text>
                ))}
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </AnimatedEntry>

      <AnimatedEntry delay={180}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured right now</Text>
          <Text style={styles.sectionSubtitle}>Product cards with quick actions and live pricing.</Text>
        </View>
        <View style={styles.featureList}>
          {featured.map((product) => {
            const inWishlist = wishlistIds.includes(product.id);
            const finalPrice = discountedPrice(product.price, product.discountPercent);

            return (
              <View key={product.id} style={styles.featureCard}>
                <Image source={{ uri: product.image }} style={styles.featureImage} resizeMode="cover" />
                <View style={styles.featureBody}>
                  <View style={styles.featureHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.productVendor}>{product.vendor ?? 'EduMart Marketplace'}</Text>
                      <Text style={styles.productName}>{product.name}</Text>
                      <Text style={styles.productMeta}>{product.subcategory ?? product.category} • {product.gradeBand}</Text>
                    </View>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{product.badge ?? `${product.discountPercent}% off`}</Text>
                    </View>
                  </View>

                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={14} color="#F59E0B" />
                    <Text style={styles.ratingText}>{product.rating.toFixed(1)} • {product.reviewCount.toLocaleString('en-IN')} reviews</Text>
                  </View>

                  <View style={styles.priceRow}>
                    <Text style={styles.priceNow}>{formatInr(finalPrice)}</Text>
                    <Text style={styles.priceOld}>{formatInr(product.price)}</Text>
                  </View>

                  <View style={styles.actionRow}>
                    <Pressable style={styles.buyButton} onPress={() => addToCart(product.id)}>
                      <Text style={styles.buyButtonText}>Add to cart</Text>
                    </Pressable>
                    <Pressable style={styles.saveButton} onPress={() => toggleWishlist(product.id)}>
                      <Ionicons name={inWishlist ? 'heart' : 'heart-outline'} size={14} color={theme.colors.accent} />
                      <Text style={styles.saveButtonText}>{inWishlist ? 'Saved' : 'Save'}</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </AnimatedEntry>

      <AnimatedEntry delay={220}>
        <View style={styles.quickGrid}>
          {quickNav.map((item) => (
            <Pressable key={item.label} style={styles.quickCard} onPress={() => router.push(item.route as never)}>
              <Ionicons name={item.icon as React.ComponentProps<typeof Ionicons>['name']} size={20} color={theme.colors.accent} />
              <Text style={styles.quickTitle}>{item.label}</Text>
            </Pressable>
          ))}
        </View>
      </AnimatedEntry>
    </ScreenShell>
  );
}

const getStyles = (theme: ReturnType<typeof useAppTheme>['theme']) =>
  StyleSheet.create({
    heroCard: {
      borderRadius: 26,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      padding: 16,
      gap: 12,
      ...theme.shadows.neumorph,
    },
    heroTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    brandMark: {
      width: 52,
      height: 52,
      borderRadius: 18,
      backgroundColor: theme.colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
    },
    brandMarkText: {
      color: theme.isDark ? '#11131B' : '#F8FBFF',
      fontSize: 18,
      fontWeight: '900',
    },
    heroBadgeWrap: {
      flex: 1,
    },
    heroBadge: {
      color: theme.colors.accent,
      fontSize: 11,
      fontWeight: '800',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    heroMeta: {
      marginTop: 2,
      color: theme.colors.textMuted,
      fontSize: 12,
      fontWeight: '700',
    },
    heroTitle: {
      fontSize: 24,
      fontWeight: '900',
      color: theme.colors.text,
      lineHeight: 30,
    },
    heroText: {
      fontSize: 13,
      lineHeight: 20,
      color: theme.colors.textMuted,
    },
    spotlightCard: {
      flexDirection: 'row',
      gap: 12,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surfaceRaised,
      padding: 10,
    },
    spotlightImage: {
      width: 78,
      height: 78,
      borderRadius: 16,
      backgroundColor: theme.colors.bgSoft,
    },
    spotlightTextWrap: {
      flex: 1,
      justifyContent: 'center',
      gap: 2,
    },
    spotlightLabel: {
      fontSize: 10,
      fontWeight: '900',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      color: theme.colors.accent,
    },
    spotlightTitle: {
      fontSize: 14,
      fontWeight: '900',
      color: theme.colors.text,
    },
    spotlightMeta: {
      fontSize: 11,
      fontWeight: '700',
      color: theme.colors.textMuted,
    },
    heroStatsRow: {
      flexDirection: 'row',
      gap: 8,
    },
    heroStat: {
      flex: 1,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surfaceRaised,
      paddingVertical: 10,
      alignItems: 'center',
    },
    heroStatValue: {
      fontSize: 18,
      fontWeight: '900',
      color: theme.colors.text,
    },
    heroStatLabel: {
      marginTop: 2,
      fontSize: 10,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      fontWeight: '800',
      color: theme.colors.textMuted,
    },
    heroActions: {
      flexDirection: 'row',
      gap: 10,
    },
    primaryButton: {
      flex: 1,
      backgroundColor: theme.colors.accent,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 13,
    },
    primaryButtonText: {
      color: theme.isDark ? '#11131B' : '#F8FBFF',
      fontSize: 14,
      fontWeight: '900',
    },
    secondaryButton: {
      flex: 1,
      backgroundColor: theme.colors.surfaceRaised,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 13,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    secondaryButtonText: {
      color: theme.colors.text,
      fontSize: 14,
      fontWeight: '800',
    },
    syncLabel: {
      fontSize: 11,
      fontWeight: '800',
      textTransform: 'uppercase',
      letterSpacing: 0.7,
      color: theme.colors.textMuted,
    },
    sectionHeader: {
      gap: 2,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '900',
      color: theme.colors.text,
    },
    sectionSubtitle: {
      fontSize: 12,
      lineHeight: 18,
      color: theme.colors.textMuted,
    },
    pillRow: {
      flexDirection: 'row',
      gap: 8,
      flexWrap: 'wrap',
    },
    pill: {
      borderRadius: 999,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      paddingHorizontal: 14,
      paddingVertical: 9,
    },
    pillActive: {
      backgroundColor: theme.colors.accent,
      borderColor: theme.colors.accent,
    },
    pillText: {
      fontSize: 12,
      fontWeight: '800',
      color: theme.colors.textMuted,
    },
    pillTextActive: {
      color: theme.isDark ? '#11131B' : '#F8FBFF',
    },
    categoryRail: {
      gap: 12,
      paddingRight: 4,
    },
    categoryCard: {
      width: 220,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      padding: 14,
      gap: 10,
      ...theme.shadows.neumorph,
    },
    categoryCardTop: {
      gap: 4,
    },
    categoryName: {
      fontSize: 15,
      fontWeight: '900',
      color: theme.colors.text,
    },
    categoryCount: {
      fontSize: 11,
      fontWeight: '800',
      color: theme.colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.7,
    },
    subcategoryWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
    },
    subcategoryChip: {
      borderRadius: 999,
      backgroundColor: theme.colors.accentSoft,
      color: theme.colors.accent,
      paddingHorizontal: 10,
      paddingVertical: 6,
      fontSize: 11,
      fontWeight: '800',
    },
    featureList: {
      gap: 12,
    },
    featureCard: {
      borderRadius: 24,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      overflow: 'hidden',
      ...theme.shadows.neumorph,
    },
    featureImage: {
      width: '100%',
      height: 180,
      backgroundColor: theme.colors.bgSoft,
    },
    featureBody: {
      padding: 14,
      gap: 10,
    },
    featureHeader: {
      flexDirection: 'row',
      gap: 10,
      alignItems: 'flex-start',
    },
    productVendor: {
      fontSize: 10,
      fontWeight: '800',
      letterSpacing: 0.7,
      textTransform: 'uppercase',
      color: theme.colors.textMuted,
    },
    productName: {
      marginTop: 2,
      fontSize: 16,
      fontWeight: '900',
      lineHeight: 22,
      color: theme.colors.text,
    },
    productMeta: {
      marginTop: 2,
      fontSize: 11,
      fontWeight: '700',
      color: theme.colors.textMuted,
    },
    badge: {
      borderRadius: 999,
      backgroundColor: theme.colors.accentSoft,
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    badgeText: {
      fontSize: 10,
      fontWeight: '800',
      textTransform: 'uppercase',
      color: theme.colors.accent,
    },
    ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    ratingText: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.colors.textMuted,
    },
    priceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap',
    },
    priceNow: {
      fontSize: 18,
      fontWeight: '900',
      color: theme.colors.text,
    },
    priceOld: {
      fontSize: 12,
      textDecorationLine: 'line-through',
      color: theme.colors.textMuted,
    },
    actionRow: {
      flexDirection: 'row',
      gap: 10,
    },
    buyButton: {
      flex: 1,
      borderRadius: 16,
      backgroundColor: theme.colors.accent,
      paddingVertical: 12,
      alignItems: 'center',
    },
    buyButtonText: {
      color: theme.isDark ? '#11131B' : '#F8FBFF',
      fontSize: 13,
      fontWeight: '900',
    },
    saveButton: {
      flex: 1,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surfaceRaised,
      paddingVertical: 12,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 6,
    },
    saveButtonText: {
      color: theme.colors.text,
      fontSize: 13,
      fontWeight: '800',
    },
    quickGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    quickCard: {
      flex: 1,
      minWidth: '47%',
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      paddingVertical: 16,
      alignItems: 'center',
      gap: 8,
      ...theme.shadows.neumorph,
    },
    quickTitle: {
      fontSize: 13,
      fontWeight: '800',
      color: theme.colors.text,
    },
  });
