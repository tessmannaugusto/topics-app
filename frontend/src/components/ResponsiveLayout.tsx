import React from 'react';
import { View, useWindowDimensions, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

interface ResponsiveLayoutProps {
  sidebar: React.ReactNode;
  content: React.ReactNode;
}

export const BREAKPOINT = 768;

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ sidebar, content }) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= BREAKPOINT;

  if (isDesktop) {
    return (
      <View style={styles.desktopContainer}>
        <View style={styles.sidebar}>
          {sidebar}
        </View>
        <View style={styles.divider} />
        <View style={styles.content}>
          {content}
        </View>
      </View>
    );
  }

  // On mobile, the routing usually handles the stack, 
  // but we can use this to render a single container if needed.
  return <View style={styles.mobileContainer}>{content}</View>;
};

const styles = StyleSheet.create({
  desktopContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
  },
  sidebar: {
    width: 350,
    borderRightWidth: 1,
    borderRightColor: theme.colors.border,
  },
  divider: {
    width: 1,
    backgroundColor: theme.colors.border,
  },
  content: {
    flex: 1,
  },
  mobileContainer: {
    flex: 1,
  },
});
