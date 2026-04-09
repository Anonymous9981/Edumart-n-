import React from 'react';
import { useRouter } from 'expo-router';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { MobileBottomDock } from '../components/mobile-bottom-dock';

export default function HomeScreen() {
  const router = useRouter();

  function openSoon(page: string) {
    Alert.alert('Coming soon', `${page} page is being prepared.`);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>KAROM EDUMART</Text>
            <Text style={styles.subtitle}>Premium Education Marketplace</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/wishlist')}>
              <Text style={styles.iconGlyph}>♡</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/cart')}>
              <Text style={styles.iconGlyph}>🛒</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroBadge}>Mobile First</Text>
          <Text style={styles.heroTitle}>Faster shopping for students and schools</Text>
          <Text style={styles.heroText}>
            Browse products, save wishlist items, and quickly move to checkout from a clean icon-first interface.
          </Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/shop')}>
            <Text style={styles.primaryButtonText}>Start shopping</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.quickGrid}>
          <TouchableOpacity style={styles.quickCard} onPress={() => router.push('/shop')}>
            <Text style={styles.quickGlyph}>🛍️</Text>
            <Text style={styles.quickTitle}>Shop</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickCard} onPress={() => router.push('/wishlist')}>
            <Text style={styles.quickGlyph}>♡</Text>
            <Text style={styles.quickTitle}>Wishlist</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickCard} onPress={() => router.push('/cart')}>
            <Text style={styles.quickGlyph}>🛒</Text>
            <Text style={styles.quickTitle}>Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickCard} onPress={() => openSoon('Offers')}>
            <Text style={styles.quickGlyph}>🏷️</Text>
            <Text style={styles.quickTitle}>Offers</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <MobileBottomDock />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fbff',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 110,
    gap: 16,
  },
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
});
