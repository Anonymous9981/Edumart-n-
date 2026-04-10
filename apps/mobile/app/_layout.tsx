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
          tabBarStyle: {
            height: 64,
            paddingTop: 8,
            borderTopColor: theme.colors.border,
            backgroundColor: theme.colors.surface,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '700',
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
