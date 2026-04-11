import { useRouter } from 'expo-router';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

import { ScreenShell } from '../components/screen-shell';
import { useMockStore } from '../lib/mock-store';
import { useAppTheme } from '../theme/theme-provider';

export default function AccountScreen() {
  const router = useRouter();
  const { theme, isDark, toggleTheme } = useAppTheme();
  const styles = getStyles(theme);
  const { user, wishlistCount, cartCount, products, contentSource, lastSyncedAt } = useMockStore();

  const quickLinks = [
    { label: 'About', route: '/more/about' },
    { label: 'Catalog', route: '/more/catalog' },
    { label: 'Checkout', route: '/more/checkout' },
    { label: 'Order Success', route: '/more/order-success' },
    { label: 'Contact', route: '/more/contact' },
    { label: 'FAQ', route: '/more/faq' },
    { label: 'Schools', route: '/more/schools' },
    { label: 'School Flow', route: '/more/school-flow' },
    { label: 'Login', route: '/more/login' },
    { label: 'Signup', route: '/more/signup' },
    { label: 'Forgot Password', route: '/more/forgot-password' },
    { label: 'Logout', route: '/more/logout' },
    { label: 'Unauthorized', route: '/more/unauthorized' },
  ] as const;

  return (
    <ScreenShell>
      <View style={styles.heroCard}>
        <Text style={styles.title}>Account</Text>
        <Text style={styles.subtitle}>Profile, app controls and every mapped flow page in one place.</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>EM</Text>
        </View>
        <View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <Text style={styles.email}>{user.school} • {user.city}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}><Text style={styles.statValue}>{products.length}</Text><Text style={styles.statLabel}>Products</Text></View>
        <View style={styles.statCard}><Text style={styles.statValue}>{wishlistCount}</Text><Text style={styles.statLabel}>Wishlist</Text></View>
        <View style={styles.statCard}><Text style={styles.statValue}>{cartCount}</Text><Text style={styles.statLabel}>Cart</Text></View>
      </View>

      <View style={styles.toggleCard}>
        <View>
          <Text style={styles.toggleTitle}>Theme mode</Text>
          <Text style={styles.toggleHint}>{isDark ? 'Dark mode enabled' : 'Light mode enabled'}</Text>
        </View>
        <Switch value={isDark} onValueChange={toggleTheme} thumbColor={theme.colors.accent} trackColor={{ false: theme.colors.border, true: theme.colors.accentSoft }} />
      </View>

      <View style={styles.syncCard}>
        <Text style={styles.syncTitle}>Website content sync</Text>
        <Text style={styles.syncText}>Source: {contentSource === 'website' ? 'Website API' : 'Fallback mock data'}</Text>
        <Text style={styles.syncText}>Last update: {lastSyncedAt ? new Date(lastSyncedAt).toLocaleString() : 'Not synced yet'}</Text>
      </View>

      <View style={styles.section}>
        {quickLinks.map((item) => (
          <TouchableOpacity key={item.label} style={styles.row} onPress={() => router.push(item.route)}>
            <Text style={styles.rowText}>{item.label}</Text>
            <Text style={styles.rowArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScreenShell>
  );
}

const getStyles = (theme: ReturnType<typeof useAppTheme>['theme']) =>
  StyleSheet.create({
    title: {
      fontSize: 28,
      fontWeight: '900',
      color: '#F8FBFF',
    },
    subtitle: {
      marginTop: 2,
      ...theme.typo.subtitle,
      color: '#D8E7F7',
    },
    heroCard: {
      borderRadius: 22,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.accent,
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    profileCard: {
      marginTop: 6,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    avatar: {
      width: 54,
      height: 54,
      borderRadius: 999,
      backgroundColor: theme.colors.accentSoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      color: theme.colors.accent,
      fontSize: 16,
      fontWeight: '800',
    },
    name: {
      fontSize: 16,
      fontWeight: '800',
      color: theme.colors.text,
    },
    email: {
      marginTop: 2,
      fontSize: 12,
      color: theme.colors.textMuted,
    },
    statsRow: {
      flexDirection: 'row',
      gap: 8,
    },
    statCard: {
      flex: 1,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      paddingVertical: 10,
      alignItems: 'center',
    },
    statValue: {
      fontSize: 19,
      fontWeight: '900',
      color: theme.colors.text,
    },
    statLabel: {
      fontSize: 10,
      fontWeight: '700',
      color: theme.colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    toggleCard: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      paddingHorizontal: 14,
      paddingVertical: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    toggleTitle: {
      fontSize: 14,
      fontWeight: '800',
      color: theme.colors.text,
    },
    toggleHint: {
      fontSize: 12,
      color: theme.colors.textMuted,
      marginTop: 2,
    },
    syncCard: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      paddingHorizontal: 14,
      paddingVertical: 12,
      gap: 4,
    },
    syncTitle: {
      fontSize: 14,
      fontWeight: '800',
      color: theme.colors.text,
    },
    syncText: {
      fontSize: 12,
      color: theme.colors.textMuted,
    },
    section: {
      borderRadius: 22,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      overflow: 'hidden',
    },
    row: {
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    rowText: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.colors.text,
    },
    rowArrow: {
      fontSize: 18,
      color: theme.colors.textMuted,
    },
  });
