import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>EduMart</Text>
      <Text style={styles.subtitle}>Premium Education Marketplace</Text>
      <Text style={styles.description}>Mobile App - Coming Soon</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.primaryButton]}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
          <Text style={styles.buttonTextSecondary}>Join Now</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>Phase 1: Foundation setup</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#0c4a6e',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#0369a1',
    marginBottom: 24,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#0284c7',
    marginBottom: 32,
  },
  buttonContainer: {
    gap: 12,
    width: '100%',
    maxWidth: 300,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#0284c7',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#0284c7',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    color: '#0284c7',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 32,
    fontSize: 12,
    color: '#0284c7',
  },
});
