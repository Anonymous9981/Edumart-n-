import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ScreenShell } from '../components/screen-shell';
import { Theme } from '../theme/tokens';

export default function AccountScreen() {
  const router = useRouter();

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
      <Text style={styles.title}>Account</Text>
      <Text style={styles.subtitle}>Manage profile and open every key web page flow from mobile.</Text>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>EM</Text>
        </View>
        <View>
          <Text style={styles.name}>EduMart User</Text>
          <Text style={styles.email}>user@edumart.com</Text>
        </View>
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

const styles = StyleSheet.create({
  title: {
    ...Theme.typo.title,
    color: Theme.colors.text,
  },
  subtitle: {
    marginTop: -4,
    ...Theme.typo.subtitle,
    color: Theme.colors.textMuted,
  },
  profileCard: {
    marginTop: 6,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    backgroundColor: Theme.colors.surface,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 999,
    backgroundColor: Theme.colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: Theme.colors.accent,
    fontSize: 16,
    fontWeight: '800',
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: Theme.colors.text,
  },
  email: {
    marginTop: 2,
    fontSize: 12,
    color: Theme.colors.textMuted,
  },
  section: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    backgroundColor: Theme.colors.surface,
    overflow: 'hidden',
  },
  row: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowText: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  rowArrow: {
    fontSize: 18,
    color: Theme.colors.textMuted,
  },
});
