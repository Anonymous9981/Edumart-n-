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
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
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
          renderLoading={() => (
            <View style={styles.loaderWrap}>
              <ActivityIndicator size="large" color={theme.colors.accent} />
              <Text style={styles.loaderText}>Loading website experience...</Text>
            </View>
          )}
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

const getStyles = (theme: ReturnType<typeof useAppTheme>['theme']) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.bg,
    },
    webWrap: {
      flex: 1,
      marginHorizontal: 10,
      marginTop: 8,
      marginBottom: 10,
      borderRadius: 22,
      borderWidth: 1.2,
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
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      backgroundColor: theme.colors.bg,
    },
    loaderText: {
      color: theme.colors.textMuted,
      fontSize: 13,
      fontWeight: '700',
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