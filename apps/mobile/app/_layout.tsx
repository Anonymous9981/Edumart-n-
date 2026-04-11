import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { MockStoreProvider } from '../lib/mock-store';
import { ThemeProvider, useAppTheme } from '../theme/theme-provider';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <MockStoreProvider>
        <RootTabs />
      </MockStoreProvider>
    </ThemeProvider>
  );
}

function RootTabs() {
  const { theme } = useAppTheme();

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
            left: 14,
            right: 14,
            bottom: 12,
            height: 68,
            borderTopWidth: 0,
            borderRadius: 22,
            paddingTop: 8,
            paddingBottom: 8,
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.surface,
            shadowColor: '#0b3558',
            shadowOpacity: theme.isDark ? 0.38 : 0.12,
            shadowRadius: 18,
            shadowOffset: { width: 0, height: 10 },
            elevation: 12,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '700',
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
      </Tabs>
    </>
  );
}
