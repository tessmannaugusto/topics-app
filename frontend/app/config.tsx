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
import { getUserConfig, saveUserConfig, UserConfig } from '../src/storage/topic-storage';

type ProviderName = 'google' | 'openai' | 'anthropic';

export default function ConfigScreen() {
  const [config, setConfig] = useState<UserConfig | null>(null);
  const [apiKeys, setApiKeys] = useState<{ [key in ProviderName]: string }>({
    google: '',
    openai: '',
    anthropic: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setIsLoading(true);
      const loadedConfig = await getUserConfig();
      setConfig(loadedConfig);
    } catch (error) {
      console.error('Error fetching config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const maskKey = (key?: string) => {
    if (!key) return '';
    return key.length > 8 
      ? `${key.substring(0, 4)}...${key.substring(key.length - 4)}`
      : '****';
  };

  const handleSave = async () => {
    if (!config) return;

    try {
      setIsSaving(true);
      
      const newConfig: UserConfig = {
        ...config,
        providers: {
          google: {
            apiKey: apiKeys.google.trim() || config.providers.google.apiKey,
            model: config.providers.google.model,
          },
          openai: {
            apiKey: apiKeys.openai.trim() || config.providers.openai.apiKey,
            model: config.providers.openai.model,
          },
          anthropic: {
            apiKey: apiKeys.anthropic.trim() || config.providers.anthropic.apiKey,
            model: config.providers.anthropic.model,
          },
        },
      };
      
      await saveUserConfig(newConfig);
      setConfig(newConfig);
      setApiKeys({ google: '', openai: '', anthropic: '' });
      
      Alert.alert('Success', 'Configuration saved locally');
    } catch (error) {
      console.error('Error saving config:', error);
      Alert.alert('Error', `Failed to save configuration: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsSaving(false);
    }
  };

  const updateDefaultProvider = (provider: ProviderName) => {
    if (!config) return;
    setConfig({ ...config, defaultProvider: provider });
  };

  const updateModel = (provider: ProviderName, model: string) => {
    if (!config) return;
    setConfig({
      ...config,
      providers: {
        ...config.providers,
        [provider]: { ...config.providers[provider], model },
      },
    });
  };

  if (isLoading || !config) {
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
        <Text style={styles.headerDescription}>
          Configure your AI providers. Keys are stored locally on this device and never sent to our servers, only to the respective AI APIs.
        </Text>

        <View style={styles.section}>
          <Text style={styles.label}>Default Provider</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={config.defaultProvider}
              onValueChange={(itemValue: ProviderName) => updateDefaultProvider(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Google Gemini" value="google" />
              <Picker.Item label="OpenAI" value="openai" />
              <Picker.Item label="Anthropic" value="anthropic" />
            </Picker>
          </View>
        </View>

        {/* Google Section */}
        <View style={styles.providerSection}>
          <Text style={styles.providerTitle}>Google Gemini</Text>
          <TextInput
            style={styles.input}
            placeholder={config.providers.google.apiKey ? "Stored: " + maskKey(config.providers.google.apiKey) : "Enter Gemini API Key"}
            placeholderTextColor={theme.colors.textSecondary}
            value={apiKeys.google}
            onChangeText={(text) => setApiKeys({ ...apiKeys, google: text })}
            secureTextEntry
            autoCapitalize="none"
          />
          <View style={[styles.pickerContainer, { marginTop: 10 }]}>
            <Picker
              selectedValue={config.providers.google.model}
              onValueChange={(itemValue: string) => updateModel('google', itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Gemini 2.5 Flash (Recommended)" value="gemini-2.5-flash" />
              <Picker.Item label="Gemini 1.5 Flash" value="gemini-1.5-flash" />
              <Picker.Item label="Gemini 1.5 Pro" value="gemini-1.5-pro" />
            </Picker>
          </View>
        </View>

        {/* OpenAI Section */}
        <View style={styles.providerSection}>
          <Text style={styles.providerTitle}>OpenAI</Text>
          <TextInput
            style={styles.input}
            placeholder={config.providers.openai.apiKey ? "Stored: " + maskKey(config.providers.openai.apiKey) : "Enter OpenAI API Key"}
            placeholderTextColor={theme.colors.textSecondary}
            value={apiKeys.openai}
            onChangeText={(text) => setApiKeys({ ...apiKeys, openai: text })}
            secureTextEntry
            autoCapitalize="none"
          />
          <View style={[styles.pickerContainer, { marginTop: 10 }]}>
            <Picker
              selectedValue={config.providers.openai.model}
              onValueChange={(itemValue: string) => updateModel('openai', itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="GPT-4o (Recommended)" value="gpt-4o" />
              <Picker.Item label="GPT-4o mini" value="gpt-4o-mini" />
              <Picker.Item label="GPT-3.5 Turbo" value="gpt-3.5-turbo" />
            </Picker>
          </View>
        </View>

        {/* Anthropic Section */}
        <View style={styles.providerSection}>
          <Text style={styles.providerTitle}>Anthropic</Text>
          <TextInput
            style={styles.input}
            placeholder={config.providers.anthropic.apiKey ? "Stored: " + maskKey(config.providers.anthropic.apiKey) : "Enter Anthropic API Key"}
            placeholderTextColor={theme.colors.textSecondary}
            value={apiKeys.anthropic}
            onChangeText={(text) => setApiKeys({ ...apiKeys, anthropic: text })}
            secureTextEntry
            autoCapitalize="none"
          />
          <View style={[styles.pickerContainer, { marginTop: 10 }]}>
            <Picker
              selectedValue={config.providers.anthropic.model}
              onValueChange={(itemValue: string) => updateModel('anthropic', itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Claude 3.5 Sonnet (Recommended)" value="claude-3-5-sonnet-20240620" />
              <Picker.Item label="Claude 3 Haiku" value="claude-3-haiku-20240307" />
              <Picker.Item label="Claude 3 Opus" value="claude-3-opus-20240229" />
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
            <Text style={styles.saveButtonText}>Save All Changes</Text>
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
    paddingBottom: 40,
  },
  headerDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 25,
    lineHeight: 20,
  },
  section: {
    marginBottom: 25,
  },
  providerSection: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  providerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  pickerContainer: {
    backgroundColor: theme.colors.background,
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
  saveButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
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
