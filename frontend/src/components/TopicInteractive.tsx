import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { theme } from '../styles/theme';
import { Topic, saveTopic } from '../storage/topic-storage';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';

interface TopicInteractiveProps {
  topic: Topic;
  onUpdateTopic: (updatedTopic: Topic) => void;
  customAlert: (title: string, message: string, onConfirm?: () => void) => void;
}

export const TopicInteractive: React.FC<TopicInteractiveProps> = ({
  topic,
  onUpdateTopic,
  customAlert,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { token } = useAuth();

  const handleGenerateQuestions = async () => {
    if (!token) {
      customAlert('Auth Error', 'You must be logged in to generate questions.');
      return;
    }

    if (topic.questions && topic.questions.length > 0) {
      customAlert(
        'Regenerate Questions',
        'Existing questions will be replaced. Continue?',
        () => performGeneration()
      );
    } else {
      performGeneration();
    }
  };

  const performGeneration = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch(`${API_URL}/generate-questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: topic.name,
          notes: topic.notes,
          script: topic.aiScript,
          count: 5
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const updatedTopic = { ...topic, questions: data.questions };
        await saveTopic(updatedTopic);
        onUpdateTopic(updatedTopic);
        setCurrentIndex(0);
        customAlert('Success', 'Learning questions generated!');
      } else {
        throw new Error(data.error || 'Failed to generate questions');
      }
    } catch (error: any) {
      customAlert('Error', error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const goToNext = () => {
    if (topic.questions && currentIndex < topic.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const hasQuestions = topic.questions && topic.questions.length > 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {!hasQuestions ? (
        <View style={styles.emptyCard}>
          <Text style={styles.title}>Interactive Mode</Text>
          <Text style={styles.description}>
            Test your knowledge by generating AI-powered questions based on your notes and script.
          </Text>
          
          {isGenerating ? (
            <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: theme.spacing.xl }} />
          ) : (
            <TouchableOpacity 
              style={styles.primaryButton} 
              onPress={handleGenerateQuestions}
              disabled={!topic.notes || topic.notes.trim().length === 0}
            >
              <Text style={styles.primaryButtonText}>GENERATE QUESTIONS</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={styles.questionSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>
              QUESTION {currentIndex + 1} OF {topic.questions?.length}
            </Text>
            <TouchableOpacity onPress={handleGenerateQuestions}>
              <Text style={styles.regenerateText}>REGENERATE ALL</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.questionCard}>
            <Text style={styles.questionText}>
              {topic.questions?.[currentIndex].text}
            </Text>
          </View>

          <View style={styles.navigation}>
            <TouchableOpacity 
              style={[styles.navButton, currentIndex === 0 && styles.disabledButton]} 
              onPress={goToPrev}
              disabled={currentIndex === 0}
            >
              <Text style={[styles.navButtonText, currentIndex === 0 && styles.disabledButtonText]}>PREVIOUS</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.navButton, currentIndex === (topic.questions?.length || 0) - 1 && styles.disabledButton]} 
              onPress={goToNext}
              disabled={currentIndex === (topic.questions?.length || 0) - 1}
            >
              <Text style={[styles.navButtonText, currentIndex === (topic.questions?.length || 0) - 1 && styles.disabledButtonText]}>NEXT</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Tip: Read the question and try to answer it in your head or out loud before moving to the next one. 
              Interactive answering and evaluation coming soon!
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
  },
  emptyCard: {
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  description: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: theme.spacing.xl,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    ...theme.typography.label,
    color: theme.colors.background,
  },
  questionSection: {
    gap: theme.spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    ...theme.typography.label,
    color: theme.colors.textSecondary,
    fontSize: 10,
  },
  regenerateText: {
    ...theme.typography.label,
    color: theme.colors.accent,
    fontSize: 10,
  },
  questionCard: {
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minHeight: 200,
    justifyContent: 'center',
  },
  questionText: {
    ...theme.typography.h3,
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 28,
  },
  navigation: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  navButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.round,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    alignItems: 'center',
  },
  navButtonText: {
    ...theme.typography.label,
    color: theme.colors.primary,
  },
  disabledButton: {
    borderColor: theme.colors.border,
  },
  disabledButtonText: {
    color: theme.colors.textSecondary,
  },
  infoBox: {
    marginTop: theme.spacing.xl,
    padding: theme.spacing.lg,
    backgroundColor: '#F0F7FF', // Light blue background for info
    borderRadius: theme.borderRadius.md,
  },
  infoText: {
    ...theme.typography.caption,
    color: theme.colors.accent,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
