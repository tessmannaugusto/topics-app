# Multi-provider AI Integration Design

## 1. Data Schema Changes

### Frontend `UserConfig`
Update `src/storage/topic-storage.ts`:

```typescript
export interface ProviderConfig {
  apiKey?: string;
  model?: string;
}

export interface UserConfig {
  // Deprecated top-level fields for backward compatibility
  geminiApiKey?: string;
  selectedModel?: string;
  
  // New structure
  providers: {
    google: ProviderConfig;
    openai: ProviderConfig;
    anthropic: ProviderConfig;
  };
  defaultProvider: 'google' | 'openai' | 'anthropic';
}
```

## 2. Backend Architecture

### Provider Interface
Create `backend/src/lib/ai-providers/types.ts`:

```typescript
export interface LlmProvider {
  generateContent(prompt: string, model: string): Promise<string>;
}

export interface ProviderRequestConfig {
  name: 'google' | 'openai' | 'anthropic';
  apiKey: string;
  model?: string;
}

export interface AiRequest {
  prompt: string;
  configs: ProviderRequestConfig[]; // Ordered list for fallback
}
```

### AI Service (Orchestrator)
Create `backend/src/lib/ai-providers/ai-service.ts`:

```typescript
export class AiService {
  static async generateWithFallback(request: AiRequest): Promise<string> {
    const errors: any[] = [];
    
    for (const config of request.configs) {
      try {
        const provider = LlmProviderFactory.getProvider(config.name, config.apiKey);
        const primaryModel = config.model || this.getDefaultModel(config.name);
        
        try {
          return await provider.generateContent(request.prompt, primaryModel);
        } catch (error) {
          console.warn(`Primary model ${primaryModel} failed for ${config.name}, trying fallback...`);
          const fallbackModel = this.getFallbackModel(config.name);
          if (fallbackModel && fallbackModel !== primaryModel) {
            return await provider.generateContent(request.prompt, fallbackModel);
          }
          throw error;
        }
      } catch (error) {
        console.error(`Provider ${config.name} failed:`, error);
        errors.push(error);
        // Continue to next provider in the list
      }
    }
    
    throw new Error(`All AI providers failed: ${errors.map(e => e.message).join(', ')}`);
  }
  
  private static getDefaultModel(name: string): string { ... }
  private static getFallbackModel(name: string): string { ... }
}
```

### Provider Factory
... (existing logic)

### Implementations
- `GoogleProvider`: Uses `@google/generative-ai` (existing logic).
- `OpenAIProvider`: Uses `openai` SDK or direct REST call.
- `AnthropicProvider`: Uses `@anthropic-ai/sdk` or direct REST call.

## 3. UI Updates (`ConfigScreen`)
- Provider Selection: A Picker to choose the default provider.
- Key Management: Sections for each provider to enter their API key.
- Model Selection: A Picker that updates options based on the selected provider.

## 4. API Request/Response
Update `POST` bodies for:
- `/api/generate-questions`
- `/api/generate-script`
- `/api/evaluate-answer`

```json
{
  "provider": "openai",
  "apiKey": "...",
  "model": "gpt-4o-mini",
  ...
}
```

## 5. Backward Compatibility & Migration
- On app start, if `geminiApiKey` exists but `providers.google.apiKey` doesn't, migrate it.
- Default to `google` if no default is set.
