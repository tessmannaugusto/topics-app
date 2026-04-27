import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import { API_URL } from '../src/config';
import { theme } from '../src/styles/theme';

export default function ConfigScreen() {
  const { token } = useAuth();
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [maskedKey, setMaskedKey] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/user/config`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.geminiApiKey) {
          setMaskedKey(data.geminiApiKey);
        }
      } else if (response.status !== 404) {
        // 404 might mean no config yet
        console.error('Failed to fetch config', await response.text());
      }
    } catch (error) {
      console.error('Error fetching config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!geminiApiKey.trim() && !maskedKey) {
      Alert.alert('Error', 'Please enter an API key');
      return;
    }

    try {
      setIsSaving(true);
      const response = await fetch(`${API_URL}/user/config`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          geminiApiKey: geminiApiKey.trim() || undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.geminiApiKey) {
          setMaskedKey(data.geminiApiKey);
          setGeminiApiKey('');
        }
        Alert.alert('Success', 'Configuration saved successfully');
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.error || 'Failed to save configuration');
      }
    } catch (error) {
      console.error('Error saving config:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.label}>Gemini API Key</Text>
          <Text style={styles.description}>
            Used for generating scripts and questions. Your key is encrypted and stored securely.
          </Text>
          <TextInput
            style={styles.input}
            placeholder={maskedKey ? maskedKey : "Enter your Gemini API Key"}
            placeholderTextColor={theme.colors.textSecondary}
            value={geminiApiKey}
            onChangeText={setGeminiApiKey}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
          {maskedKey ? (
            <Text style={styles.infoText}>
              Current key: {maskedKey} (Enter new key to update)
            </Text>
          ) : null}
        </View>

        <TouchableOpacity
          style={[styles.saveButton, isSaving && styles.disabledButton]}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 15,
    lineHeight: 20,
  },
  input: {
    backgroundColor: theme.colors.card,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  infoText: {
    marginTop: 8,
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  disabledButton: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
