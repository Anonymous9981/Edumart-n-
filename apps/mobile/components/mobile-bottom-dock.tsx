import React from 'react';
import { usePathname, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const NAV_ITEMS: Array<{ href: string; icon: string; label: string }> = [
  { href: '/', icon: '⌂', label: 'Home' },
  { href: '/shop', icon: '🛍️', label: 'Shop' },
  { href: '/wishlist', icon: '♡', label: 'Wishlist' },
  { href: '/cart', icon: '🛒', label: 'Cart' },
];

export function MobileBottomDock() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.bottomDock}>
      {NAV_ITEMS.map((item) => {
        const isHome = item.href === '/' && (pathname === '/' || pathname === '/index');
        const isActive = isHome || pathname === item.href;

        return (
          <TouchableOpacity
            key={String(item.href)}
            style={[styles.dockItem, isActive ? styles.dockItemActive : null]}
            onPress={() => router.push(item.href as never)}
            accessibilityRole="button"
            accessibilityLabel={item.label}
          >
            <Text style={[styles.iconGlyph, isActive ? styles.iconGlyphActive : null]}>{item.icon}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomDock: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#dbe7f3',
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    shadowColor: '#0b3558',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  dockItem: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dockItemActive: {
    backgroundColor: '#e8f2ff',
  },
  iconGlyph: {
    fontSize: 20,
    color: '#0B3558',
    fontWeight: '700',
  },
  iconGlyphActive: {
    color: '#082b49',
  },
});
