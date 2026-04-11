import Constants from 'expo-constants';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, BackHandler, Linking, Platform, Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

import { useAppTheme } from '../theme/theme-provider';

interface WebRouteScreenProps {
  path: string;
  title: string;
}

type NavigationState = {
  canGoBack: boolean;
  canGoForward: boolean;
  loading: boolean;
  url: string;
};

function resolveWebBaseUrl() {
  const extra = Constants.expoConfig?.extra as { webApiBaseUrl?: string } | undefined;
  const envUrl = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env
    ?.EXPO_PUBLIC_WEB_API_BASE_URL?.trim();
  return envUrl || extra?.webApiBaseUrl?.trim() || '';
}

export function WebRouteScreen({ path, title }: WebRouteScreenProps) {
  const { theme, mode } = useAppTheme();
  const styles = getStyles(theme);
  const webViewRef = useRef<WebView>(null);
  const baseUrl = useMemo(resolveWebBaseUrl, []);
  const [state, setState] = useState<NavigationState>({
    canGoBack: false,
    canGoForward: false,
    loading: true,
    url: '',
  });

  const targetUrl = useMemo(() => {
    if (!baseUrl) {
      return '';
    }

    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
  }, [baseUrl, path]);

  const injectedBridge = useMemo(
    () => `
      (function () {
        try {
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
    `,
    [mode, theme.colors.bg],
  );

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

  const activeUrl = state.url || targetUrl;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.topCard}>
        <View>
          <Text style={styles.topLabel}>{title}</Text>
          <Text style={styles.topUrl} numberOfLines={1}>{activeUrl}</Text>
        </View>
        {state.loading ? <ActivityIndicator size="small" color={theme.colors.accent} /> : null}
      </View>

      <View style={styles.toolbar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          style={[styles.toolButton, !state.canGoBack ? styles.toolButtonDisabled : null]}
          disabled={!state.canGoBack}
          onPress={() => webViewRef.current?.goBack()}
        >
          <Text style={styles.toolText}>Back</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Forward"
          style={[styles.toolButton, !state.canGoForward ? styles.toolButtonDisabled : null]}
          disabled={!state.canGoForward}
          onPress={() => webViewRef.current?.goForward()}
        >
          <Text style={styles.toolText}>Next</Text>
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Refresh" style={styles.toolButton} onPress={() => webViewRef.current?.reload()}>
          <Text style={styles.toolText}>Refresh</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open in browser"
          style={styles.toolButton}
          onPress={async () => {
            const supported = await Linking.canOpenURL(activeUrl);
            if (!supported) {
              Alert.alert('Cannot open browser', 'This link is not supported on this device.');
              return;
            }
            await Linking.openURL(activeUrl);
          }}
        >
          <Text style={styles.toolText}>Browser</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Share link"
          style={styles.toolButton}
          onPress={async () => {
            await Share.share({ message: activeUrl, url: activeUrl, title: title });
          }}
        >
          <Text style={styles.toolText}>Share</Text>
        </Pressable>
      </View>

      <View style={styles.webWrap}>
        <WebView
          ref={webViewRef}
          source={{ uri: targetUrl }}
          injectedJavaScript={injectedBridge}
          javaScriptEnabled
          domStorageEnabled
          setSupportMultipleWindows={false}
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
              canGoForward: event.canGoForward,
              loading: event.loading,
              url: event.url,
            });
          }}
        />
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
    topCard: {
      marginHorizontal: 12,
      marginTop: 8,
      marginBottom: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
    },
    topLabel: {
      color: theme.colors.text,
      fontSize: 12,
      fontWeight: '900',
      textTransform: 'uppercase',
      letterSpacing: 0.7,
    },
    topUrl: {
      marginTop: 2,
      color: theme.colors.textMuted,
      fontSize: 11,
      maxWidth: 250,
    },
    toolbar: {
      marginHorizontal: 12,
      marginBottom: 8,
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    toolButton: {
      borderRadius: 999,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      paddingHorizontal: 12,
      paddingVertical: 7,
    },
    toolButtonDisabled: {
      opacity: 0.45,
    },
    toolText: {
      color: theme.colors.text,
      fontSize: 11,
      fontWeight: '800',
    },
    webWrap: {
      flex: 1,
      marginHorizontal: 12,
      marginBottom: 12,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
      overflow: 'hidden',
      backgroundColor: theme.colors.surface,
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