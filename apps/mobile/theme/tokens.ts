export const lightColors = {
  bg: '#EEF3F8',
  bgSoft: '#E5ECF4',
  surface: '#FFFFFF',
  surfaceRaised: '#EDF3FA',
  border: '#D4DFEC',
  text: '#0B1E35',
  textMuted: '#506076',
  accent: '#0B3558',
  accentSoft: '#D7E8FA',
  success: '#0CA678',
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
  accent: '#00B58A',
  accentSoft: '#123D38',
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
