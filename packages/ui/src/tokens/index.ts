// Color tokens
export const colors = {
  // Neutral
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Primary (Brand color)
  primary: {
    50: '#F0F9FF',
    100: '#E0F2FE',
    200: '#BAE6FD',
    300: '#7DD3FC',
    400: '#38BDF8',
    500: '#0EA5E9',
    600: '#0284C7',
    700: '#0369A1',
    800: '#075985',
    900: '#0C4A6E',
  },

  // Success
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
  },

  // Warning
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    300: '#FCD34D',
    500: '#FBBF24',
    600: '#F59E0B',
    700: '#D97706',
  },

  // Danger/Error
  danger: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    300: '#FCA5A5',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
  },
};

// Typography tokens
export const typography = {
  fontFamily: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
};

// Spacing tokens
export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
};

// Border radius tokens
export const borderRadius = {
  none: '0',
  sm: '0.125rem',  // 2px
  base: '0.25rem', // 4px
  md: '0.375rem',  // 6px
  lg: '0.5rem',    // 8px
  xl: '0.75rem',   // 12px
  '2xl': '1rem',   // 16px
  '3xl': '1.5rem', // 24px
  full: '9999px',
};

// Shadow tokens
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
};

// Transition tokens
export const transitions = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
  timing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// Z-index tokens
export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  backdrop: 1040,
  offcanvas: 1050,
  modal: 1060,
  tooltip: 1070,
};

// Breakpoints
export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

// Component size tokens
export const componentSizes = {
  // Button sizes
  button: {
    sm: {
      height: '2rem',      // 32px
      padding: '0.5rem 1rem', // px-4 py-2
      fontSize: '0.875rem', // sm
    },
    base: {
      height: '2.5rem',     // 40px
      padding: '0.75rem 1.5rem', // px-6 py-3
      fontSize: '1rem',    // base
    },
    lg: {
      height: '3rem',       // 48px
      padding: '1rem 2rem', // px-8 py-4
      fontSize: '1.125rem', // lg
    },
  },
  // Input sizes
  input: {
    sm: {
      height: '2rem',      // 32px
      padding: '0.5rem 0.75rem',
      fontSize: '0.875rem',
    },
    base: {
      height: '2.5rem',    // 40px
      padding: '0.75rem 1rem',
      fontSize: '1rem',
    },
    lg: {
      height: '3rem',      // 48px
      padding: '1rem 1.25rem',
      fontSize: '1.125rem',
    },
  },
};
