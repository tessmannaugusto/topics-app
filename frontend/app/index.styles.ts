import { StyleSheet } from 'react-native';
import { theme } from '../src/styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
  },
  listContent: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.giant,
  },
  topicItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  topicInfo: {
    flex: 1,
    paddingRight: theme.spacing.md,
  },
  topicName: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  topicDate: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  audioControls: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  audioButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  playButton: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  generateButton: {
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
  },
  buttonText: {
    ...theme.typography.label,
    fontSize: 10,
    color: theme.colors.background,
  },
  generateButtonText: {
    ...theme.typography.label,
    fontSize: 10,
    color: theme.colors.textSecondary,
  },
  emptyText: {
    ...theme.typography.body,
    textAlign: 'center',
    marginTop: theme.spacing.giant,
    color: theme.colors.textSecondary,
  },
  fab: {
    position: 'absolute',
    right: theme.spacing.lg,
    bottom: theme.spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  fabText: {
    fontSize: 24,
    color: theme.colors.background,
    fontWeight: '300',
  },
});
