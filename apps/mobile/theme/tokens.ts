export const lightColors = {
  bg: '#F8FBFF',
  bgSoft: '#EAF2FB',
  surface: '#FFFFFF',
  surfaceRaised: '#F5F9FF',
  border: '#DBE4EE',
  text: '#0F172A',
  textMuted: '#475569',
  accent: '#0B3558',
  accentSoft: '#DFF3EE',
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
  accent: '#00A67E',
  accentSoft: '#153A34',
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
