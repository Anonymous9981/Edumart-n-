import Constants from 'expo-constants';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, BackHandler, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

import { useAppTheme } from '../theme/theme-provider';

interface WebRouteScreenProps {
  path: string;
  title: string;
}

type NavigationState = {
  canGoBack: boolean;
  loading: boolean;
};

function resolveWebBaseUrl() {
  const extra = Constants.expoConfig?.extra as { webApiBaseUrl?: string } | undefined;
  const envUrl = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env
    ?.EXPO_PUBLIC_WEB_API_BASE_URL?.trim();
  return envUrl || extra?.webApiBaseUrl?.trim() || '';
}

export function WebRouteScreen({ path, title }: WebRouteScreenProps) {
  const { theme, mode, toggleTheme } = useAppTheme();
  const styles = getStyles(theme);
  const webViewRef = useRef<WebView>(null);
  const baseUrl = useMemo(resolveWebBaseUrl, []);
  const [state, setState] = useState<NavigationState>({
    canGoBack: false,
    loading: true,
  });

  const targetUrl = useMemo(() => {
    if (!baseUrl) {
      return '';
    }

    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
  }, [baseUrl, path]);

  const nativeThemeBridge = useMemo(
    () => {
      const viewport = "width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover";
      return `
      (function () {
        try {
          var viewportMeta = document.querySelector('meta[name="viewport"]');
          if (!viewportMeta) {
            viewportMeta = document.createElement('meta');
            viewportMeta.setAttribute('name', 'viewport');
            document.head.appendChild(viewportMeta);
          }
          viewportMeta.setAttribute('content', '${viewport}');
          var styleTag = document.getElementById('edumart-native-bridge-style');
          if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'edumart-native-bridge-style';
            document.head.appendChild(styleTag);
          }
          styleTag.textContent = 'html,body{overscroll-behavior:none;-webkit-text-size-adjust:100%;text-size-adjust:100%;touch-action:manipulation;} input,select,textarea,button{font-size:16px !important;}';
          document.documentElement.setAttribute('data-app-shell', 'edumart-mobile');
          document.documentElement.setAttribute('data-native-theme', '${mode}');
          document.documentElement.classList.remove('dark', 'light');
          document.documentElement.classList.add('${mode}');
          var meta = document.querySelector('meta[name="theme-color"]');
          if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('name', 'theme-color');
            document.head.appendChild(meta);
          }
          meta.setAttribute('content', '${theme.colors.bg}');
          document.body.style.background = '${theme.colors.bg}';
        } catch (e) {}
      })();
      true;
    `;
    },
    [mode, theme.colors.bg],
  );

  useEffect(() => {
    webViewRef.current?.injectJavaScript(nativeThemeBridge);
  }, [nativeThemeBridge]);

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'android') {
        return undefined;
      }

      const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        if (state.canGoBack) {
          webViewRef.current?.goBack();
          return true;
        }

        return false;
      });

      return () => subscription.remove();
    }, [state.canGoBack]),
  );

  if (!targetUrl) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.errorWrap}>
          <Text style={styles.errorTitle}>Website URL not configured</Text>
          <Text style={styles.errorText}>Set EXPO_PUBLIC_WEB_API_BASE_URL or expo.extra.webApiBaseUrl to render website pages in APK.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.webWrap}>
        <WebView
          ref={webViewRef}
          source={{ uri: targetUrl }}
          originWhitelist={['*']}
          injectedJavaScriptBeforeContentLoaded={nativeThemeBridge}
          javaScriptEnabled
          domStorageEnabled
          textZoom={100}
          setSupportMultipleWindows={false}
          setBuiltInZoomControls={false}
          setDisplayZoomControls={false}
          scalesPageToFit={false}
          bounces={false}
          overScrollMode="never"
          allowsBackForwardNavigationGestures
          pullToRefreshEnabled
          startInLoadingState
          renderLoading={() => <WebSkeleton theme={theme} />}
          onNavigationStateChange={(event) => {
            setState({
              canGoBack: event.canGoBack,
              loading: event.loading,
            });
          }}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
          style={styles.themeToggle}
          onPress={() => {
            const nextMode = mode === 'dark' ? 'light' : 'dark';
            toggleTheme();
            webViewRef.current?.injectJavaScript(
              `(function(){try{document.documentElement.setAttribute('data-native-theme','${nextMode}');document.documentElement.classList.remove('dark','light');document.documentElement.classList.add('${nextMode}');}catch(e){}})(); true;`,
            );
          }}
        >
          <Text style={styles.themeToggleText}>{mode === 'dark' ? 'Light' : 'Dark'}</Text>
        </Pressable>
        {state.loading ? (
          <View pointerEvents="none" style={styles.loadingChip}>
            <ActivityIndicator size="small" color={theme.colors.accent} />
            <Text style={styles.loadingChipText}>{title}</Text>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

function WebSkeleton({ theme }: { theme: ReturnType<typeof useAppTheme>['theme'] }) {
  const styles = getStyles(theme);

  return (
    <View style={styles.loaderWrap}>
      <View style={styles.skeletonHero} />
      <View style={styles.skeletonGrid}>
        {Array.from({ length: 4 }).map((_, index) => (
          <View key={index} style={styles.skeletonCard}>
            <View style={styles.skeletonMedia} />
            <View style={styles.skeletonLineShort} />
            <View style={styles.skeletonLineLong} />
            <View style={styles.skeletonAction} />
          </View>
        ))}
      </View>
      <Text style={styles.loaderText}>Loading products and cards...</Text>
    </View>
  );
}

const getStyles = (theme: ReturnType<typeof useAppTheme>['theme']) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.bg,
    },
    webWrap: {
      flex: 1,
      marginHorizontal: 0,
      marginTop: 0,
      marginBottom: 0,
      borderRadius: 0,
      borderWidth: 0,
      borderColor: theme.colors.border,
      overflow: 'hidden',
      backgroundColor: theme.colors.surface,
    },
    themeToggle: {
      position: 'absolute',
      top: 12,
      right: 12,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      paddingHorizontal: 12,
      paddingVertical: 7,
      shadowColor: '#000000',
      shadowOpacity: theme.isDark ? 0.32 : 0.12,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 5,
    },
    themeToggleText: {
      color: theme.colors.text,
      fontSize: 11,
      fontWeight: '900',
      letterSpacing: 0.2,
    },
    loadingChip: {
      position: 'absolute',
      left: 12,
      top: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    loadingChipText: {
      color: theme.colors.text,
      fontSize: 11,
      fontWeight: '800',
    },
    loaderWrap: {
      flex: 1,
      paddingHorizontal: 12,
      paddingTop: 12,
      gap: 10,
      backgroundColor: theme.colors.bg,
    },
    skeletonHero: {
      height: 110,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surfaceRaised,
    },
    skeletonGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      justifyContent: 'space-between',
    },
    skeletonCard: {
      width: '48%',
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      padding: 8,
      gap: 8,
    },
    skeletonMedia: {
      height: 88,
      borderRadius: 10,
      backgroundColor: theme.colors.surfaceRaised,
    },
    skeletonLineShort: {
      height: 8,
      width: '55%',
      borderRadius: 999,
      backgroundColor: theme.colors.surfaceRaised,
    },
    skeletonLineLong: {
      height: 10,
      width: '90%',
      borderRadius: 999,
      backgroundColor: theme.colors.surfaceRaised,
    },
    skeletonAction: {
      height: 28,
      borderRadius: 8,
      backgroundColor: theme.colors.surfaceRaised,
    },
    loaderText: {
      color: theme.colors.textMuted,
      fontSize: 13,
      fontWeight: '700',
      textAlign: 'center',
      marginTop: 6,
    },
    errorWrap: {
      marginHorizontal: 16,
      marginTop: 20,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      padding: 16,
      gap: 8,
    },
    errorTitle: {
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: '900',
    },
    errorText: {
      color: theme.colors.textMuted,
      fontSize: 13,
      lineHeight: 20,
    },
  });