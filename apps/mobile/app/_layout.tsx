import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemeProvider, useAppTheme } from '../theme/theme-provider';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootTabs />
    </ThemeProvider>
  );
}

function RootTabs() {
  const { theme, mode, toggleTheme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = getStyles(theme);

  return (
    <>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.colors.accent,
          tabBarInactiveTintColor: theme.colors.textMuted,
          tabBarHideOnKeyboard: true,
          tabBarShowLabel: true,
          tabBarStyle: {
            position: 'absolute',
            left: 12,
            right: 12,
            bottom: 10,
            height: 70,
            borderTopWidth: 0,
            borderRadius: 24,
            paddingTop: 8,
            paddingBottom: 8,
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.surface,
            shadowColor: '#0b3558',
            shadowOpacity: theme.isDark ? 0.3 : 0.1,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 6 },
            elevation: 7,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '800',
          },
          tabBarItemStyle: {
            paddingTop: 2,
            paddingBottom: 2,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="shop"
          options={{
            title: 'Shop',
            tabBarIcon: ({ color, size }) => <Ionicons name="bag-handle-outline" color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            title: 'Cart',
            tabBarIcon: ({ color, size }) => <Ionicons name="cart-outline" color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="wishlist"
          options={{
            title: 'Wishlist',
            tabBarIcon: ({ color, size }) => <Ionicons name="heart-outline" color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: 'Account',
            tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" color={color} size={size} />,
          }}
        />
        <Tabs.Screen name="offers" options={{ href: null }} />
        <Tabs.Screen name="offers/prime" options={{ href: null }} />
        <Tabs.Screen name="offers/refer" options={{ href: null }} />
        <Tabs.Screen name="shop/[id]" options={{ href: null }} />
        <Tabs.Screen name="more" options={{ href: null }} />
        <Tabs.Screen name="login" options={{ href: null }} />
        <Tabs.Screen name="signup" options={{ href: null }} />
      </Tabs>
      <View pointerEvents="box-none" style={styles.overlayWrap}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
          style={[styles.themeToggle, { top: Math.max(insets.top + 4, 10) }]}
          onPress={toggleTheme}
        >
          <Ionicons
            name={mode === 'dark' ? 'sunny-outline' : 'moon-outline'}
            size={24}
            color={theme.colors.text}
          />
        </Pressable>
      </View>
    </>
  );
}

const getStyles = (theme: ReturnType<typeof useAppTheme>['theme']) =>
  StyleSheet.create({
    overlayWrap: {
      ...StyleSheet.absoluteFillObject,
    },
    themeToggle: {
      position: 'absolute',
      right: 12,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      paddingHorizontal: 12,
      paddingVertical: 7,
      shadowColor: '#000000',
      shadowOpacity: theme.isDark ? 0.28 : 0.12,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 6,
    },
  });
