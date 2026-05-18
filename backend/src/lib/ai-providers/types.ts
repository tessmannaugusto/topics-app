export interface LlmProvider {
  generateContent(prompt: string, model: string): Promise<string>;
}

export type ProviderName = 'google' | 'openai' | 'anthropic';

export interface ProviderRequestConfig {
  name: ProviderName;
  apiKey: string;
  model?: string;
}

export interface AiRequest {
  prompt: string;
  configs: ProviderRequestConfig[]; // Ordered list for fallback
}
