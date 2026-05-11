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
import { Picker } from '@react-native-picker/picker';
import { theme } from '../src/styles/theme';
import { getUserConfig, saveUserConfig } from '../src/storage/topic-storage';

export default function ConfigScreen() {
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [maskedKey, setMaskedKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setIsLoading(true);
      const config = await getUserConfig();
      if (config.geminiApiKey) {
        const masked = config.geminiApiKey.length > 8 
          ? `${config.geminiApiKey.substring(0, 4)}...${config.geminiApiKey.substring(config.geminiApiKey.length - 4)}`
          : '****';
        setMaskedKey(masked);
      }
      if (config.selectedModel) {
        setSelectedModel(config.selectedModel);
      }
    } catch (error) {
      console.error('Error fetching config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      console.log('Saving config with model:', selectedModel);
      
      const existingConfig = await getUserConfig();
      const newConfig = {
        geminiApiKey: geminiApiKey.trim() || existingConfig.geminiApiKey,
        selectedModel: selectedModel,
      };
      
      console.log('Saving new config:', newConfig);
      await saveUserConfig(newConfig);
      
      if (geminiApiKey.trim()) {
        const masked = geminiApiKey.trim().length > 8 
          ? `${geminiApiKey.trim().substring(0, 4)}...${geminiApiKey.trim().substring(geminiApiKey.trim().length - 4)}`
          : '****';
        setMaskedKey(masked);
        setGeminiApiKey('');
      }
      
      console.log('Config saved successfully');
      Alert.alert('Success', 'Configuration saved locally');
    } catch (error) {
      console.error('CRITICAL Error saving config:', error);
      Alert.alert('Error', `Failed to save configuration: ${error instanceof Error ? error.message : String(error)}`);
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
            Used for generating scripts and questions. Your key is stored locally on this device.
          </Text>
          <TextInput
            style={styles.input}
            placeholder={maskedKey ? "Stored (Enter new key to update)" : "Enter your Gemini API Key"}
            placeholderTextColor={theme.colors.textSecondary}
            value={geminiApiKey}
            onChangeText={setGeminiApiKey}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
          {maskedKey ? (
            <Text style={styles.infoText}>
              Current key: {maskedKey}
            </Text>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>AI Model</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedModel}
              onValueChange={(itemValue: string) => setSelectedModel(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Gemini 2.5 Flash" value="gemini-2.5-flash" />
            </Picker>
          </View>
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
  pickerContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    height: 50,
    justifyContent: 'center',
  },
  picker: {
    color: theme.colors.text,
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
