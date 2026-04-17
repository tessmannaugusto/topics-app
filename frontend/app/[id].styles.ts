import { StyleSheet, Platform } from 'react-native';
import { theme } from '../src/styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.giant,
  },
  header: {
    marginBottom: theme.spacing.xxl,
  },
  name: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  date: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  section: {
    marginBottom: theme.spacing.xxl,
  },
  label: {
    ...theme.typography.label,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  notes: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  input: {
    ...theme.typography.body,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  audioSection: {
    marginTop: theme.spacing.lg,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  audioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  audioTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },
  deleteAudioButton: {
    padding: theme.spacing.xs,
  },
  deleteAudioText: {
    ...theme.typography.label,
    fontSize: 10,
    color: theme.colors.error,
  },
  playerControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playIconButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.lg,
  },
  playIcon: {
    fontSize: 24,
    color: theme.colors.background,
    marginLeft: 4, // Visual centering for play icon
  },
  pauseIcon: {
    fontSize: 24,
    color: theme.colors.background,
  },
  progressContainer: {
    flex: 1,
  },
  timeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.xs,
  },
  timeText: {
    ...theme.typography.caption,
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  actions: {
    marginTop: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    ...theme.typography.label,
    color: theme.colors.background,
  },
  secondaryButton: {
    backgroundColor: theme.colors.background,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  secondaryButtonText: {
    ...theme.typography.label,
    color: theme.colors.text,
  },
  dangerButton: {
    marginTop: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  dangerButtonText: {
    ...theme.typography.label,
    color: theme.colors.error,
    opacity: 0.8,
  },
});
