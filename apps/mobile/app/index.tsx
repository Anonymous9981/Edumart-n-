import React from 'react';
import { useRouter } from 'expo-router';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ScreenShell, SkeletonBlock } from '../components/screen-shell';

export default function HomeScreen() {
  const router = useRouter();

  function openSoon(page: string) {
    Alert.alert('Coming soon', `${page} page is being prepared.`);
  }

  return (
    <ScreenShell>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>KAROM EDUMART</Text>
            <Text style={styles.subtitle}>Premium Education Marketplace</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/wishlist' as never)}>
              <Text style={styles.iconGlyph}>♡</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/cart' as never)}>
              <Text style={styles.iconGlyph}>🛒</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.logoPanel}>
          <Image source={require('../assets/2025-07-15-687640b3953e5.webp')} style={styles.logoImage} resizeMode="contain" />
          <Text style={styles.logoLabel}>Official Karom EduMart mark</Text>
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroBadge}>Mobile First</Text>
          <Text style={styles.heroTitle}>Faster shopping for students and schools</Text>
          <Text style={styles.heroText}>
            Browse products, save wishlist items, and quickly move to checkout from a clean icon-first interface.
          </Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/shop' as never)}>
            <Text style={styles.primaryButtonText}>Start shopping</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.quickGrid}>
          <TouchableOpacity style={styles.quickCard} onPress={() => router.push('/shop' as never)}>
            <Text style={styles.quickGlyph}>🛍️</Text>
            <Text style={styles.quickTitle}>Shop</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickCard} onPress={() => router.push('/wishlist' as never)}>
            <Text style={styles.quickGlyph}>♡</Text>
            <Text style={styles.quickTitle}>Wishlist</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickCard} onPress={() => router.push('/cart' as never)}>
            <Text style={styles.quickGlyph}>🛒</Text>
            <Text style={styles.quickTitle}>Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickCard} onPress={() => router.push('/offers' as never)}>
            <Text style={styles.quickGlyph}>🏷️</Text>
            <Text style={styles.quickTitle}>Offers</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.loaderCard}>
          <Text style={styles.loaderTitle}>Recommended for you</Text>
          <SkeletonBlock height={14} />
          <SkeletonBlock height={14} />
          <SkeletonBlock height={80} />
        </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
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
    borderColor: '#dbe7f3',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0b3558',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  iconGlyph: {
    fontSize: 20,
    color: '#0B3558',
    fontWeight: '700',
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0B3558',
  },
  subtitle: {
    fontSize: 12,
    color: '#4b6a88',
    marginTop: 2,
  },
  heroCard: {
    borderRadius: 22,
    padding: 18,
    backgroundColor: '#0B3558',
    shadowColor: '#0B3558',
    shadowOpacity: 0.24,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#1f4e78',
    color: '#d6e8ff',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  heroTitle: {
    marginTop: 10,
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
  },
  heroText: {
    marginTop: 8,
    color: '#d6e8ff',
    fontSize: 14,
    lineHeight: 21,
  },
  primaryButton: {
    marginTop: 14,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 12,
  },
  primaryButtonText: {
    color: '#0B3558',
    fontSize: 15,
    fontWeight: '700',
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  quickCard: {
    width: '48.5%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#dbe7f3',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 8,
  },
  quickTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0B3558',
  },
  quickGlyph: {
    fontSize: 24,
  },
  logoPanel: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#dbe7f3',
    backgroundColor: '#ffffff',
    padding: 12,
    alignItems: 'center',
    gap: 6,
  },
  logoImage: {
    width: 120,
    height: 120,
  },
  logoLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#43617e',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  loaderCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#dbe7f3',
    backgroundColor: '#ffffff',
    padding: 14,
    gap: 8,
  },
  loaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0B3558',
    marginBottom: 2,
  },
});
