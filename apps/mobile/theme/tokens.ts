export const lightColors = {
  bg: '#F4F8FF',
  bgSoft: '#E9F0FB',
  surface: '#FFFFFF',
  surfaceRaised: '#F9FBFF',
  border: '#D7E2F1',
  text: '#10243A',
  textMuted: '#4F667E',
  accent: '#0B3558',
  accentSoft: '#DBE9F8',
  success: '#16915B',
  danger: '#D14343',
};

export const darkColors = {
  bg: '#0E131B',
  bgSoft: '#121925',
  surface: '#171F2C',
  surfaceRaised: '#1C2533',
  border: '#2A3448',
  text: '#F3F6FF',
  textMuted: '#A8B5CB',
  accent: '#D4AF37',
  accentSoft: '#3A2F14',
  success: '#34D399',
  danger: '#F87171',
};

const typo = {
  title: {
    fontSize: 30,
    fontWeight: '900' as const,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '500' as const,
  },
};

export function createTheme(isDark: boolean) {
  return {
    isDark,
    colors: isDark ? darkColors : lightColors,
    typo,
    shadows: {
      neumorph: {
        shadowColor: isDark ? '#000000' : '#5C7396',
        shadowOpacity: isDark ? 0.42 : 0.16,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 10 },
        elevation: 8,
      },
    },
  };
}
