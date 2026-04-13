import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '../theme/theme-provider';

interface ScreenShellProps {
  children: ReactNode;
  withScroll?: boolean;
}

export function ScreenShell({ children, withScroll = true }: ScreenShellProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useAppTheme();
  const styles = getStyles(theme);

  if (!withScroll) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.bgOrbTop} />
        <View style={styles.bgOrbBottom} />
        <View style={[styles.container, { paddingTop: insets.top > 0 ? 8 : 14 }]}>{children}</View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.bgOrbTop} />
      <View style={styles.bgOrbBottom} />
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
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  return <View style={[styles.skeleton, { height }]} />;
}

const getStyles = (theme: ReturnType<typeof useAppTheme>['theme']) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.bg,
    },
    bgOrbTop: {
      position: 'absolute',
      top: -120,
      left: -80,
      width: 260,
      height: 260,
      borderRadius: 180,
      backgroundColor: theme.colors.accentSoft,
      opacity: theme.isDark ? 0.2 : 0.45,
    },
    bgOrbBottom: {
      position: 'absolute',
      right: -90,
      bottom: 40,
      width: 220,
      height: 220,
      borderRadius: 140,
      backgroundColor: theme.colors.bgSoft,
      opacity: theme.isDark ? 0.22 : 0.6,
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
      backgroundColor: theme.colors.surfaceRaised,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
  });
