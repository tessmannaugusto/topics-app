import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const formStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
  },
  field: {
    marginBottom: theme.spacing.xl,
  },
  label: {
    ...theme.typography.label,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  importButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.primary + '20', // 20% opacity primary
    borderRadius: theme.borderRadius.sm,
  },
  importButtonText: {
    ...theme.typography.label,
    color: theme.colors.primary,
    fontSize: 10,
  },
  micButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.primary + '20',
    borderRadius: theme.borderRadius.sm,
    marginLeft: theme.spacing.sm,
  },
  micButtonRecording: {
    backgroundColor: theme.colors.error,
  },
  micButtonText: {
    ...theme.typography.label,
    color: theme.colors.primary,
    fontSize: 10,
  },
  micButtonTextRecording: {
    color: theme.colors.background,
  },
  input: {
    ...theme.typography.body,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    color: theme.colors.text,
  },
  textArea: {
    ...theme.typography.body,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    minHeight: 150,
    textAlignVertical: 'top',
    marginTop: theme.spacing.sm,
  },
  footer: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    ...theme.typography.label,
    color: theme.colors.background,
  },
  cancelButton: {
    marginTop: theme.spacing.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    ...theme.typography.label,
    color: theme.colors.textSecondary,
    fontSize: 10,
  },
});
