import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ScreenShell, SkeletonBlock } from '../components/screen-shell';

export default function WishlistScreen() {
  return (
    <ScreenShell>
        <Text style={styles.title}>Wishlist</Text>
        <Text style={styles.subtitle}>Save products here and move them to cart anytime.</Text>

        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>♡</Text>
          <Text style={styles.emptyTitle}>Your wishlist is ready</Text>
          <Text style={styles.emptyText}>Tap heart icons from Shop or Home to add products here.</Text>
        </View>

        <View style={styles.skeletonArea}>
          <SkeletonBlock height={14} />
          <SkeletonBlock height={14} />
          <SkeletonBlock height={48} />
        </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
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
  skeletonArea: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#dbe7f3',
    backgroundColor: '#ffffff',
    padding: 12,
    gap: 8,
  },
});
