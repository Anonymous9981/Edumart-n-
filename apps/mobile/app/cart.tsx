import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { MobileBottomDock } from '../components/mobile-bottom-dock';

export default function CartScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Cart</Text>
        <Text style={styles.subtitle}>Review selected items and continue to checkout.</Text>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLine}>Items: 0</Text>
          <Text style={styles.summaryLine}>Subtotal: INR 0</Text>
          <Text style={styles.summaryLine}>Delivery: INR 0</Text>
          <Text style={styles.totalLine}>Total: INR 0</Text>
          <TouchableOpacity style={styles.checkoutButton}>
            <Text style={styles.checkoutText}>Proceed to checkout</Text>
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
  summaryCard: {
    marginTop: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#dbe7f3',
    backgroundColor: '#ffffff',
    padding: 16,
    gap: 8,
  },
  summaryLine: {
    fontSize: 14,
    color: '#38526a',
  },
  totalLine: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: '800',
    color: '#0B3558',
  },
  checkoutButton: {
    marginTop: 10,
    borderRadius: 12,
    backgroundColor: '#0B3558',
    alignItems: 'center',
    paddingVertical: 12,
  },
  checkoutText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
