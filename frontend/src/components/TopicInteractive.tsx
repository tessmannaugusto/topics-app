import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, TextInput, Platform } from 'react-native';
import { theme } from '../styles/theme';
import { Topic, saveTopic, getUserConfig } from '../storage/topic-storage';
import { API_URL } from '../config';
import { startRecording, stopRecording } from '../storage/voice-recorder';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
  const [tempAnswer, setTempAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Load existing answer when question changes
  useEffect(() => {
    if (topic.questions && topic.questions[currentIndex]) {
      setTempAnswer(topic.questions[currentIndex].answer || '');
    }
  }, [currentIndex, topic.questions]);

  const handleGenerateQuestions = async () => {
    if (topic.questions && topic.questions.length > 0) {
      customAlert(
        'Regenerate Questions',
        'Existing questions and answers will be replaced. Continue?',
        () => performGeneration()
      );
    } else {
      performGeneration();
    }
  };

  const performGeneration = async () => {
    setIsGenerating(true);
    try {
      const config = await getUserConfig();
      const response = await fetch(`${API_URL}/generate-questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: topic.name,
          notes: topic.notes,
          script: topic.aiScript,
          count: 5,
          apiKey: config.geminiApiKey,
          model: config.selectedModel,
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

  const handleSaveAnswer = async () => {
    if (!topic.questions) return;
    
    const updatedQuestions = [...topic.questions];
    updatedQuestions[currentIndex] = {
      ...updatedQuestions[currentIndex],
      answer: tempAnswer.trim()
    };

    const updatedTopic = { ...topic, questions: updatedQuestions };
    try {
      await saveTopic(updatedTopic);
      onUpdateTopic(updatedTopic);
    } catch (error: any) {
      customAlert('Error', 'Failed to save answer');
    }
  };

  const handleEvaluate = async () => {
    if (!topic.questions || !tempAnswer.trim()) return;

    setIsEvaluating(true);
    try {
      const config = await getUserConfig();
      const response = await fetch(`${API_URL}/evaluate-answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: topic.questions[currentIndex].text,
          answer: tempAnswer,
          notes: topic.notes,
          apiKey: config.geminiApiKey,
          model: config.selectedModel,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const updatedQuestions = [...topic.questions];
        updatedQuestions[currentIndex] = {
          ...updatedQuestions[currentIndex],
          answer: tempAnswer.trim(),
          evaluation: {
            status: data.status,
            feedback: data.feedback
          }
        };

        const updatedTopic = { ...topic, questions: updatedQuestions };
        await saveTopic(updatedTopic);
        onUpdateTopic(updatedTopic);
      } else {
        throw new Error(data.error || 'Evaluation failed');
      }
    } catch (error: any) {
      customAlert('Evaluation Error', error.message);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleTryAgain = async () => {
    if (!topic.questions) return;

    const updatedQuestions = [...topic.questions];
    updatedQuestions[currentIndex] = {
      ...updatedQuestions[currentIndex],
      answer: undefined,
      evaluation: undefined
    };

    const updatedTopic = { ...topic, questions: updatedQuestions };
    try {
      await saveTopic(updatedTopic);
      onUpdateTopic(updatedTopic);
      setTempAnswer('');
    } catch (error: any) {
      customAlert('Error', 'Failed to reset question');
    }
  };

  const handleToggleMic = async () => {
    if (isRecording) {
      const result = await stopRecording();
      setIsRecording(false);
      
      if (result) {
        if (result.transcript) {
          // Web STT
          setTempAnswer(prev => (prev ? `${prev} ${result.transcript}` : result.transcript!));
        } else if (result.audioBase64) {
          // Native STT via Backend
          setIsTranscribing(true);
          try {
            const config = await getUserConfig();
            const response = await fetch(`${API_URL}/transcribe`, {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                audioContent: result.audioBase64,
                apiKey: config.geminiApiKey,
                platform: Platform.OS
              }),
            });
            const data = await response.json();
            if (response.ok && data.transcript) {
              setTempAnswer(prev => (prev ? `${prev} ${data.transcript}` : data.transcript));
            } else {
              throw new Error(data.error || 'Transcription failed');
            }
          } catch (err: any) {
            customAlert('Transcription Error', err.message);
          } finally {
            setIsTranscribing(false);
          }
        }
      }
    } else {
      const started = await startRecording((text) => {
        // Live transcript for Web
      });
      if (started) {
        setIsRecording(true);
      } else {
        customAlert('Mic Error', 'Could not access microphone');
      }
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
  const currentQuestion = topic.questions?.[currentIndex];
  const isAnswered = !!currentQuestion?.answer;
  const evaluation = currentQuestion?.evaluation;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'correct': return theme.colors.success;
      case 'partial': return '#FF9500'; // Orange
      case 'incorrect': return theme.colors.error;
      default: return theme.colors.textSecondary;
    }
  };

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
              {currentQuestion?.text}
            </Text>
          </View>

          <View style={styles.answerSection}>
            <View style={styles.answerHeader}>
              <Text style={styles.sectionLabel}>YOUR ANSWER</Text>
              {isAnswered && <Text style={styles.answeredBadge}>ANSWERED</Text>}
            </View>
            
            {evaluation ? (
              <View style={[styles.evaluationCard, { borderColor: getStatusColor(evaluation.status) }]}>
                <View style={styles.evaluationHeader}>
                  <Text style={[styles.statusLabel, { color: getStatusColor(evaluation.status) }]}>
                    {evaluation.status.toUpperCase()}
                  </Text>
                  <TouchableOpacity onPress={handleTryAgain}>
                    <Text style={styles.tryAgainText}>TRY AGAIN</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.answerReview}>"{currentQuestion.answer}"</Text>
                <View style={styles.divider} />
                <Text style={styles.feedbackText}>{evaluation.feedback}</Text>
              </View>
            ) : (
              <>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.answerInput}
                    placeholder="Type your answer here..."
                    placeholderTextColor={theme.colors.textSecondary}
                    multiline
                    value={tempAnswer}
                    onChangeText={setTempAnswer}
                  />
                  
                  <TouchableOpacity 
                    style={[styles.micButton, isRecording && styles.micButtonActive]} 
                    onPress={handleToggleMic}
                    disabled={isTranscribing || isEvaluating}
                  >
                    {isTranscribing ? (
                      <ActivityIndicator size="small" color={theme.colors.primary} />
                    ) : (
                      <MaterialCommunityIcons 
                        name={isRecording ? "stop" : "microphone"} 
                        size={24} 
                        color={isRecording ? theme.colors.error : theme.colors.primary} 
                      />
                    )}
                  </TouchableOpacity>
                </View>

                <View style={styles.actionRow}>
                  <TouchableOpacity 
                    style={[
                      styles.saveButton, 
                      styles.secondaryButton,
                      (!tempAnswer.trim() || tempAnswer === currentQuestion?.answer) && styles.saveButtonDisabled
                    ]} 
                    onPress={handleSaveAnswer}
                    disabled={!tempAnswer.trim() || tempAnswer === currentQuestion?.answer || isEvaluating}
                  >
                    <Text style={styles.secondaryButtonText}>SAVE ONLY</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[
                      styles.saveButton, 
                      styles.flexButton,
                      (!tempAnswer.trim()) && styles.saveButtonDisabled
                    ]} 
                    onPress={handleEvaluate}
                    disabled={!tempAnswer.trim() || isEvaluating}
                  >
                    {isEvaluating ? (
                      <ActivityIndicator size="small" color={theme.colors.background} />
                    ) : (
                      <Text style={styles.saveButtonText}>EVALUATE ANSWER</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}
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
              Tip: Speak or type your answer then click "Evaluate Answer" to get AI-powered feedback on your accuracy!
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
    minHeight: 120,
    justifyContent: 'center',
  },
  questionText: {
    ...theme.typography.h3,
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 28,
  },
  answerSection: {
    gap: theme.spacing.md,
  },
  answerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionLabel: {
    ...theme.typography.label,
    color: theme.colors.textSecondary,
  },
  answeredBadge: {
    ...theme.typography.label,
    color: theme.colors.success,
    fontSize: 10,
  },
  evaluationCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  evaluationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  statusLabel: {
    ...theme.typography.label,
    fontSize: 14,
  },
  tryAgainText: {
    ...theme.typography.label,
    color: theme.colors.accent,
    fontSize: 10,
  },
  answerReview: {
    ...theme.typography.body,
    fontStyle: 'italic',
    color: theme.colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.sm,
  },
  feedbackText: {
    ...theme.typography.body,
    color: theme.colors.text,
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    alignItems: 'flex-end',
  },
  answerInput: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    minHeight: 100,
    ...theme.typography.body,
    textAlignVertical: 'top',
  },
  micButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButtonActive: {
    borderColor: theme.colors.error,
    backgroundColor: '#FFF5F5',
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  flexButton: {
    flex: 2,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  secondaryButtonText: {
    ...theme.typography.label,
    color: theme.colors.textSecondary,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    ...theme.typography.label,
    color: theme.colors.background,
  },
  actionRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
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
    marginTop: theme.spacing.md,
    padding: theme.spacing.lg,
    backgroundColor: '#F0F7FF',
    borderRadius: theme.borderRadius.md,
  },
  infoText: {
    ...theme.typography.caption,
    color: theme.colors.accent,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
