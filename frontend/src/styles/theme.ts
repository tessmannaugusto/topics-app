export const theme = {
  colors: {
    background: '#FFFFFF',
    text: '#1A1A1A',
    textSecondary: '#757575',
    primary: '#000000',
    accent: '#007AFF', // Standard blue for some actions, but sparingly
    border: '#EEEEEE',
    card: '#FBFBFB',
    error: '#FF3B30',
    success: '#34C759',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    giant: 64,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: '700' as const,
      letterSpacing: -0.5,
      lineHeight: 40,
    },
    h2: {
      fontSize: 24,
      fontWeight: '600' as const,
      letterSpacing: -0.3,
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600' as const,
      letterSpacing: -0.2,
      lineHeight: 28,
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 24,
    },
    caption: {
      fontSize: 14,
      fontWeight: '400' as const,
      color: '#757575',
    },
    label: {
      fontSize: 12,
      fontWeight: '600' as const,
      textTransform: 'uppercase' as const,
      letterSpacing: 1,
    }
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    round: 100,
  }
};
