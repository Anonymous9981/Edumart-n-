import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ScreenShell, SkeletonBlock } from '../components/screen-shell';

export default function CartScreen() {
  return (
    <ScreenShell>
        <Text style={styles.title}>Cart</Text>
        <Text style={styles.subtitle}>Review selected items and continue to checkout.</Text>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}><Text style={styles.summaryLine}>Items</Text><Text style={styles.summaryLine}>0</Text></View>
          <View style={styles.summaryRow}><Text style={styles.summaryLine}>Subtotal</Text><Text style={styles.summaryLine}>INR 0</Text></View>
          <View style={styles.summaryRow}><Text style={styles.summaryLine}>Delivery</Text><Text style={[styles.summaryLine, styles.free]}>Free</Text></View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}><Text style={styles.totalLine}>Total</Text><Text style={styles.totalLine}>INR 0</Text></View>
          <TouchableOpacity style={styles.checkoutButton}>
            <Text style={styles.checkoutText}>Proceed to checkout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.loaderArea}>
          <SkeletonBlock height={16} />
          <SkeletonBlock height={52} />
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
  summaryCard: {
    marginTop: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#dbe7f3',
    backgroundColor: '#ffffff',
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
    backgroundColor: '#e9eef6',
  },
  summaryLine: {
    fontSize: 14,
    color: '#38526a',
  },
  free: {
    color: '#0f9b58',
    fontWeight: '700',
  },
  totalLine: {
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
  loaderArea: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#dbe7f3',
    backgroundColor: '#ffffff',
    padding: 12,
    gap: 8,
  },
});
