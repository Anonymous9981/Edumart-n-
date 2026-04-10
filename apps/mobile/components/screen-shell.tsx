import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenShellProps {
  children: ReactNode;
  withScroll?: boolean;
}

export function ScreenShell({ children, withScroll = true }: ScreenShellProps) {
  const insets = useSafeAreaInsets();

  if (!withScroll) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={[styles.container, { paddingTop: insets.top > 0 ? 8 : 14 }]}>{children}</View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top > 0 ? 8 : 14, paddingBottom: 28 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function SkeletonBlock({ height = 16 }: { height?: number }) {
  return <View style={[styles.skeleton, { height }]} />;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f3f7ff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 14,
  },
  content: {
    paddingHorizontal: 16,
    gap: 14,
  },
  skeleton: {
    borderRadius: 12,
    backgroundColor: '#dde7f4',
  },
});
