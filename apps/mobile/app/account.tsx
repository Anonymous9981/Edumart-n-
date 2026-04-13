import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ScreenShell } from '../components/screen-shell';
import { useNativeStore } from '../lib/native-store';
import { useAppTheme } from '../theme/theme-provider';

export default function AccountScreen() {
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const { cartCount, wishlistCount, refresh } = useNativeStore();

  return (
    <ScreenShell>
      <View style={styles.hero}>
        <Text style={styles.title}>Your Account</Text>
        <Text style={styles.subtitle}>Native profile hub connected to live catalog state.</Text>
      </View>

      <View style={styles.metrics}>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{cartCount}</Text>
          <Text style={styles.metricLabel}>Cart Items</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{wishlistCount}</Text>
          <Text style={styles.metricLabel}>Wishlist</Text>
        </View>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelHeading}>Quick Actions</Text>
        <Pressable style={styles.action} onPress={refresh}>
          <Text style={styles.actionText}>Refresh live catalog</Text>
        </Pressable>
        <Pressable style={styles.action}>
          <Text style={styles.actionText}>Manage profile (coming next)</Text>
        </Pressable>
        <Pressable style={styles.action}>
          <Text style={styles.actionText}>Manage addresses (coming next)</Text>
        </Pressable>
      </View>
    </ScreenShell>
  );
}

const getStyles = (theme: ReturnType<typeof useAppTheme>['theme']) =>
  StyleSheet.create({
    hero: {
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      padding: 14,
      gap: 6,
      ...theme.shadows.neumorph,
    },
    title: {
      fontSize: 24,
      color: theme.colors.text,
      fontWeight: '900',
    },
    subtitle: {
      fontSize: 12,
      color: theme.colors.textMuted,
      fontWeight: '600',
    },
    metrics: {
      flexDirection: 'row',
      gap: 10,
    },
    metricCard: {
      flex: 1,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      padding: 12,
      alignItems: 'center',
      gap: 2,
      ...theme.shadows.neumorph,
    },
    metricValue: {
      fontSize: 20,
      color: theme.colors.accent,
      fontWeight: '900',
    },
    metricLabel: {
      fontSize: 11,
      color: theme.colors.textMuted,
      fontWeight: '700',
    },
    panel: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      padding: 12,
      gap: 8,
      ...theme.shadows.neumorph,
    },
    panelHeading: {
      fontSize: 14,
      color: theme.colors.text,
      fontWeight: '900',
      marginBottom: 2,
    },
    action: {
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surfaceRaised,
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    actionText: {
      fontSize: 12,
      color: theme.colors.text,
      fontWeight: '700',
    },
  });
