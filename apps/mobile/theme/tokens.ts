export const lightColors = {
  bg: '#FFFFFF',
  bgSoft: '#F9F9F9',
  surface: '#FDFDFD',
  surfaceRaised: '#FFFFFF',
  border: '#E0E0E0',
  text: '#212121',
  textMuted: '#757575',
  accent: '#00A67E',
  accentSoft: '#E0F2F1',
  success: '#4CAF50',
  warning: '#FFC107',
  danger: '#F44336',
};

export const darkColors = {
  bg: '#121212',
  bgSoft: '#1E1E1E',
  surface: '#2C2C2C',
  surfaceRaised: '#373737',
  border: '#424242',
  text: '#FFFFFF',
  textMuted: '#BDBDBD',
  accent: '#00A67E',
  accentSoft: '#1E3A3A',
  success: '#81C784',
  warning: '#FFD54F',
  danger: '#E57373',
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
