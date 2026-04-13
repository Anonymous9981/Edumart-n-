export const lightColors = {
  bg: '#F4F8FC',
  bgSoft: '#E9F1FA',
  surface: '#FFFFFF',
  surfaceRaised: '#F7FAFE',
  border: '#DBE4EE',
  text: '#0F172A',
  textMuted: '#475569',
  accent: '#0B3558',
  accentSoft: '#DFF7EE',
  success: '#00A67E',
  warning: '#FF8A24',
  danger: '#D14343',
};

export const darkColors = {
  bg: '#07101E',
  bgSoft: '#111D30',
  surface: '#0E1A2D',
  surfaceRaised: '#152338',
  border: '#233651',
  text: '#EDF4FF',
  textMuted: '#A9BAD1',
  accent: '#00A67E',
  accentSoft: '#123D38',
  success: '#34D399',
  warning: '#FDBA74',
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
  caption: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
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
        shadowOpacity: isDark ? 0.28 : 0.1,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 5,
      },
    },
  };
}
