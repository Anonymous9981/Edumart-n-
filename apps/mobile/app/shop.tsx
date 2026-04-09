import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { MobileBottomDock } from '../components/mobile-bottom-dock';

const SAMPLE_PRODUCTS = [
  { id: 'p1', name: 'Smart Study Lamp', price: 'INR 1,299' },
  { id: 'p2', name: 'School Geometry Box', price: 'INR 249' },
  { id: 'p3', name: 'Teacher Planner Pro', price: 'INR 599' },
];

export default function ShopScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Shop</Text>
        <Text style={styles.subtitle}>Browse curated products for students and schools.</Text>

        <View style={styles.list}>
          {SAMPLE_PRODUCTS.map((item) => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardPrice}>{item.price}</Text>
              <TouchableOpacity style={styles.cardButton}>
                <Text style={styles.cardButtonText}>Add to cart</Text>
              </TouchableOpacity>
            </View>
          ))}
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
  list: {
    gap: 10,
    marginTop: 8,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#dbe7f3',
    backgroundColor: '#ffffff',
    padding: 14,
    gap: 6,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0B3558',
  },
  cardPrice: {
    fontSize: 13,
    color: '#4b6a88',
  },
  cardButton: {
    marginTop: 4,
    borderRadius: 10,
    backgroundColor: '#0B3558',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  cardButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
});
