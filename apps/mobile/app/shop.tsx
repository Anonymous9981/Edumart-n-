import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AnimatedEntry } from '../components/ui/animated-entry';
import { ScreenShell } from '../components/screen-shell';
import { AppButton } from '../components/ui/app-button';
import { InfoCard } from '../components/ui/info-card';
import { useMockStore } from '../lib/mock-store';
import { discountedPrice, formatInr } from '../lib/mock-utils';
import { useAppTheme } from '../theme/theme-provider';

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

export default function ShopScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string; subcategory?: string }>();
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const { products, categoryTree, wishlistIds, addToCart, toggleWishlist, audienceFilter, setAudienceFilter } = useMockStore();

  const [activeCategory, setActiveCategory] = React.useState<string>('All');
  const [activeSubcategory, setActiveSubcategory] = React.useState<string>('All');

  const categoryIndex = React.useMemo(
    () =>
      new Map(
        categoryTree.map((category) => [
          slugify(category.name),
          {
            ...category,
            subcategoryMap: new Map(category.subcategories.map((subcategory) => [slugify(subcategory), subcategory])),
          },
        ]),
      ),
    [categoryTree],
  );

  React.useEffect(() => {
    const categorySlug = Array.isArray(params.category) ? params.category[0] : params.category;
    const subcategorySlug = Array.isArray(params.subcategory) ? params.subcategory[0] : params.subcategory;

    if (!categorySlug) {
      return;
    }

    const matchedCategory = categoryIndex.get(categorySlug);
    if (!matchedCategory) {
      return;
    }

    setActiveCategory(matchedCategory.name);

    if (subcategorySlug && matchedCategory.subcategoryMap.has(subcategorySlug)) {
      setActiveSubcategory(matchedCategory.subcategoryMap.get(subcategorySlug) ?? 'All');
    } else {
      setActiveSubcategory('All');
    }
  }, [categoryIndex, params.category, params.subcategory]);

  const categoryChips = React.useMemo(() => ['All', ...categoryTree.map((category) => category.name)], [categoryTree]);

  const activeCategoryData = React.useMemo(
    () => categoryTree.find((category) => category.name === activeCategory),
    [categoryTree, activeCategory],
  );

  const visibleProducts = React.useMemo(
    () =>
      products.filter(
        (product) =>
          (activeCategory === 'All' || product.category === activeCategory) &&
          (activeSubcategory === 'All' || product.subcategory === activeSubcategory) &&
          (audienceFilter === 'all' || product.audience === audienceFilter),
      ),
    [products, activeCategory, activeSubcategory, audienceFilter],
  );

  const featuredProducts = React.useMemo(
    () => products.filter((product) => product.featured).slice(0, 4),
    [products],
  );

  const openCategory = React.useCallback((categoryName: string) => {
    setActiveCategory(categoryName);
    setActiveSubcategory('All');
    router.push(`/shop?category=${slugify(categoryName)}` as never);
  }, [router]);

  const openSubcategory = React.useCallback((categoryName: string, subcategoryName: string) => {
    setActiveCategory(categoryName);
    setActiveSubcategory(subcategoryName);
    router.push(`/shop?category=${slugify(categoryName)}&subcategory=${slugify(subcategoryName)}` as never);
  }, [router]);

  return (
    <ScreenShell>
      <AnimatedEntry>
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.brandMark}>
              <Ionicons name="bag-handle" size={20} color={theme.isDark ? '#11131B' : '#F8FBFF'} />
            </View>
            <View style={styles.heroBadgeWrap}>
              <Text style={styles.heroBadge}>Shop</Text>
              <Text style={styles.heroMeta}>Website categories, subcategories and products</Text>
            </View>
          </View>
          <Text style={styles.heroTitle}>Browse products first with clean category filters.</Text>
          <Text style={styles.heroText}>
            The mobile shop now mirrors the draft website style with branded cards, compact rails and native actions.
          </Text>
          <View style={styles.heroActions}>
            <Pressable style={styles.primaryButton} onPress={() => router.push('/offers' as never)}>
              <Text style={styles.primaryButtonText}>View offers</Text>
            </Pressable>
            <Pressable style={styles.secondaryButton} onPress={() => {
              setActiveCategory('All');
              setActiveSubcategory('All');
              setAudienceFilter('all');
            }}>
              <Text style={styles.secondaryButtonText}>Reset filters</Text>
            </Pressable>
          </View>
        </View>
      </AnimatedEntry>

      <AnimatedEntry delay={90}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Audience</Text>
          <Text style={styles.sectionSubtitle}>Keep the shopping feed focused for each buyer type.</Text>
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

      <AnimatedEntry delay={130}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <Text style={styles.sectionSubtitle}>Select a category, then choose a subcategory.</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRail}>
          {categoryChips.map((label) => (
            <Pressable
              key={label}
              style={[styles.categoryChip, activeCategory === label ? styles.categoryChipActive : null]}
              onPress={() => {
                if (label === 'All') {
                  setActiveCategory('All');
                  setActiveSubcategory('All');
                  router.push('/shop' as never);
                  return;
                }
                openCategory(label);
              }}
            >
              <Text style={[styles.categoryChipText, activeCategory === label ? styles.categoryChipTextActive : null]}>{label}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </AnimatedEntry>

      {activeCategoryData?.subcategories.length ? (
        <AnimatedEntry delay={160}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Subcategories</Text>
            <Text style={styles.sectionSubtitle}>Jump directly into the deeper catalog lane.</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.subcategoryRail}>
            <Pressable
              style={[styles.subcategoryChip, activeSubcategory === 'All' ? styles.subcategoryChipActive : null]}
              onPress={() => setActiveSubcategory('All')}
            >
              <Text style={[styles.subcategoryChipText, activeSubcategory === 'All' ? styles.subcategoryChipTextActive : null]}>All</Text>
            </Pressable>
            {activeCategoryData.subcategories.map((subcategory) => (
              <Pressable
                key={subcategory}
                style={[styles.subcategoryChip, activeSubcategory === subcategory ? styles.subcategoryChipActive : null]}
                onPress={() => openSubcategory(activeCategory, subcategory)}
              >
                <Text style={[styles.subcategoryChipText, activeSubcategory === subcategory ? styles.subcategoryChipTextActive : null]}>
                  {subcategory}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </AnimatedEntry>
      ) : null}

      <AnimatedEntry delay={190}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured products</Text>
          <Text style={styles.sectionSubtitle}>{visibleProducts.length.toLocaleString('en-IN')} products shown</Text>
        </View>
      </AnimatedEntry>

      <AnimatedEntry delay={210}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featureRail}>
          {featuredProducts.map((product) => {
            const inWishlist = wishlistIds.includes(product.id);
            return (
              <Pressable
                key={product.id}
                style={styles.featureCard}
                onPress={() => router.push(`/shop/${product.id}` as never)}
              >
                <Image source={{ uri: product.image }} style={styles.featureImage} resizeMode="cover" />
                <View style={styles.featureBody}>
                  <Text style={styles.productVendor}>{product.vendor ?? 'EduMart Marketplace'}</Text>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productMeta}>{product.subcategory ?? product.category}</Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.priceNow}>{formatInr(discountedPrice(product.price, product.discountPercent))}</Text>
                    <Text style={styles.priceOld}>{formatInr(product.price)}</Text>
                  </View>
                  <View style={styles.inlineActions}>
                    <AppButton label="Cart" onPress={() => addToCart(product.id)} />
                    <AppButton
                      label={inWishlist ? 'Saved' : 'Save'}
                      variant="secondary"
                      onPress={() => toggleWishlist(product.id)}
                    />
                  </View>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </AnimatedEntry>

      <AnimatedEntry delay={240}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>All products</Text>
          <Text style={styles.sectionSubtitle}>Cards with quick actions, website colors and native spacing.</Text>
        </View>
        <View style={styles.list}>
          {visibleProducts.length ? (
            visibleProducts.map((item) => {
              const inWishlist = wishlistIds.includes(item.id);
              const finalPrice = discountedPrice(item.price, item.discountPercent);

              return (
                <InfoCard
                  key={item.id}
                  title={item.name}
                  subtitle={`${item.subcategory ?? item.category} • ${item.gradeBand} • ${item.rating.toFixed(1)}★ (${item.reviewCount})`}
                >
                  <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
                  <View style={styles.cardBadge}>
                    <Text style={styles.cardBadgeText}>{item.badge ?? `${item.discountPercent}% off`}</Text>
                  </View>
                  <View style={styles.priceRow}>
                    <Text style={styles.priceNow}>{formatInr(finalPrice)}</Text>
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
            })
          ) : (
            <View style={styles.emptyCard}>
              <Ionicons name="search-outline" size={24} color={theme.colors.accent} />
              <Text style={styles.emptyTitle}>No products found</Text>
              <Text style={styles.emptyText}>Try another category, subcategory or audience filter.</Text>
            </View>
          )}
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
      gap: 10,
      paddingRight: 4,
    },
    categoryChip: {
      borderRadius: 999,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      paddingHorizontal: 14,
      paddingVertical: 10,
    },
    categoryChipActive: {
      backgroundColor: theme.colors.accent,
      borderColor: theme.colors.accent,
    },
    categoryChipText: {
      fontSize: 12,
      fontWeight: '800',
      color: theme.colors.textMuted,
    },
    categoryChipTextActive: {
      color: theme.isDark ? '#11131B' : '#F8FBFF',
    },
    subcategoryRail: {
      gap: 10,
      paddingRight: 4,
    },
    subcategoryChip: {
      borderRadius: 999,
      backgroundColor: theme.colors.accentSoft,
      paddingHorizontal: 14,
      paddingVertical: 10,
    },
    subcategoryChipActive: {
      backgroundColor: theme.colors.accent,
    },
    subcategoryChipText: {
      fontSize: 12,
      fontWeight: '800',
      color: theme.colors.accent,
    },
    subcategoryChipTextActive: {
      color: theme.isDark ? '#11131B' : '#F8FBFF',
    },
    featureRail: {
      gap: 12,
      paddingRight: 4,
    },
    featureCard: {
      width: 260,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      overflow: 'hidden',
      ...theme.shadows.neumorph,
    },
    featureImage: {
      width: '100%',
      height: 150,
      backgroundColor: theme.colors.bgSoft,
    },
    featureBody: {
      padding: 14,
      gap: 8,
    },
    productVendor: {
      fontSize: 10,
      fontWeight: '800',
      textTransform: 'uppercase',
      color: theme.colors.textMuted,
      letterSpacing: 0.8,
    },
    productName: {
      fontSize: 15,
      fontWeight: '900',
      color: theme.colors.text,
      lineHeight: 21,
    },
    productMeta: {
      fontSize: 11,
      fontWeight: '700',
      color: theme.colors.textMuted,
    },
    priceRow: {
      flexDirection: 'row',
      gap: 8,
      alignItems: 'center',
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
    inlineActions: {
      flexDirection: 'row',
      gap: 8,
    },
    list: {
      gap: 10,
      marginTop: 2,
    },
    cardBadge: {
      alignSelf: 'flex-start',
      borderRadius: 999,
      backgroundColor: theme.colors.accentSoft,
      paddingHorizontal: 8,
      paddingVertical: 4,
      marginTop: 2,
    },
    cardImage: {
      width: '100%',
      height: 140,
      borderRadius: 14,
      backgroundColor: theme.colors.bgSoft,
    },
    cardBadgeText: {
      fontSize: 10,
      fontWeight: '700',
      color: theme.colors.accent,
      textTransform: 'uppercase',
    },
    rowButtons: {
      marginTop: 8,
      flexDirection: 'row',
      gap: 8,
      flexWrap: 'wrap',
    },
    emptyCard: {
      marginTop: 4,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      padding: 18,
      alignItems: 'center',
      gap: 6,
    },
    emptyTitle: {
      fontSize: 16,
      fontWeight: '900',
      color: theme.colors.text,
    },
    emptyText: {
      fontSize: 12,
      lineHeight: 18,
      textAlign: 'center',
      color: theme.colors.textMuted,
    },
  });
