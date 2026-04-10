import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ScreenShell } from '../components/screen-shell';

export default function AccountScreen() {
  return (
    <ScreenShell>
      <Text style={styles.title}>Account</Text>
      <Text style={styles.subtitle}>Manage profile, addresses and your order preferences.</Text>

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
        {['Saved Addresses', 'Order History', 'Notifications', 'Help Center', 'Logout'].map((item) => (
          <TouchableOpacity key={item} style={styles.row}>
            <Text style={styles.rowText}>{item}</Text>
            <Text style={styles.rowArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: '#0B3558',
  },
  subtitle: {
    marginTop: -4,
    fontSize: 13,
    lineHeight: 20,
    color: '#45627f',
  },
  profileCard: {
    marginTop: 6,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#d5e2f2',
    backgroundColor: '#ffffff',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 999,
    backgroundColor: '#0B3558',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0B3558',
  },
  email: {
    marginTop: 2,
    fontSize: 12,
    color: '#55748f',
  },
  section: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#d5e2f2',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  row: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#edf2f9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#183e61',
  },
  rowArrow: {
    fontSize: 18,
    color: '#7f94aa',
  },
});
