import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { MobileBottomDock } from '../components/mobile-bottom-dock';

export default function WishlistScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Wishlist</Text>
        <Text style={styles.subtitle}>Save products here and move them to cart anytime.</Text>

        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>♡</Text>
          <Text style={styles.emptyTitle}>Your wishlist is ready</Text>
          <Text style={styles.emptyText}>Tap heart icons from Shop or Home to add products here.</Text>
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
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0B3558',
  },
  subtitle: {
    fontSize: 13,
    color: '#4b6a88',
  },
  emptyCard: {
    marginTop: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#dbe7f3',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 26,
    gap: 6,
  },
  emptyIcon: {
    fontSize: 28,
    color: '#0B3558',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0B3558',
  },
  emptyText: {
    fontSize: 13,
    color: '#4b6a88',
    textAlign: 'center',
    lineHeight: 20,
  },
});
