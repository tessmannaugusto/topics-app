import { AiRequest, ProviderName } from './types';
import { LlmProviderFactory } from './providers';

export class AiService {
  static async generateWithFallback(request: AiRequest): Promise<string> {
    const errors: any[] = [];
    
    // Filter out configs with missing API keys
    const validConfigs = request.configs.filter(config => config.apiKey && config.apiKey.trim() !== '');

    if (validConfigs.length === 0) {
      throw new Error('No valid AI provider configurations (with API keys) provided.');
    }

    for (const config of validConfigs) {
      try {
        const provider = LlmProviderFactory.getProvider(config.name, config.apiKey);
        const primaryModel = config.model || this.getDefaultModel(config.name);
        
        try {
          console.log(`Attempting ${config.name} with model ${primaryModel}...`);
          return await provider.generateContent(request.prompt, primaryModel);
        } catch (error: any) {
          console.warn(`Primary model ${primaryModel} failed for ${config.name}, trying fallback...`, error.message);
          const fallbackModel = this.getFallbackModel(config.name);
          
          if (fallbackModel && fallbackModel !== primaryModel) {
            try {
              console.log(`Attempting ${config.name} with fallback model ${fallbackModel}...`);
              return await provider.generateContent(request.prompt, fallbackModel);
            } catch (fallbackError: any) {
              console.error(`Fallback model ${fallbackModel} also failed for ${config.name}:`, fallbackError.message);
              throw fallbackError;
            }
          }
          throw error;
        }
      } catch (error: any) {
        console.error(`Provider ${config.name} failed:`, error.message);
        errors.push({ provider: config.name, message: error.message });
        // Continue to next provider in the list
      }
    }
    
    throw new Error(`All AI providers failed: ${errors.map(e => `[${e.provider}] ${e.message}`).join(', ')}`);
  }
  
  private static getDefaultModel(name: ProviderName): string {
    switch (name) {
      case 'google': return 'gemini-2.5-flash';
      case 'openai': return 'gpt-4o';
      case 'anthropic': return 'claude-3-5-sonnet-20240620';
      default: return '';
    }
  }
  
  private static getFallbackModel(name: ProviderName): string {
    switch (name) {
      case 'google': return 'gemini-1.5-flash';
      case 'openai': return 'gpt-4o-mini';
      case 'anthropic': return 'claude-3-haiku-20240307';
      default: return '';
    }
  }
}
