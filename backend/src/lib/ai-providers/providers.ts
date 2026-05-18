import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { LlmProvider, ProviderName } from './types';

export class GoogleProvider implements LlmProvider {
  constructor(private apiKey: string) {}

  async generateContent(prompt: string, model: string): Promise<string> {
    const genAI = new GoogleGenerativeAI(this.apiKey);
    const genModel = genAI.getGenerativeModel({ model });
    const result = await genModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }
}

export class OpenAIProvider implements LlmProvider {
  constructor(private apiKey: string) {}

  async generateContent(prompt: string, model: string): Promise<string> {
    const openai = new OpenAI({ apiKey: this.apiKey });
    const response = await openai.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
    });
    return response.choices[0]?.message?.content || '';
  }
}

export class AnthropicProvider implements LlmProvider {
  constructor(private apiKey: string) {}

  async generateContent(prompt: string, model: string): Promise<string> {
    const anthropic = new Anthropic({ apiKey: this.apiKey });
    const response = await anthropic.messages.create({
      model,
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    });
    // Anthropic returns an array of content blocks
    return response.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('\n');
  }
}

export class LlmProviderFactory {
  static getProvider(name: ProviderName, apiKey: string): LlmProvider {
    switch (name) {
      case 'google':
        return new GoogleProvider(apiKey);
      case 'openai':
        return new OpenAIProvider(apiKey);
      case 'anthropic':
        return new AnthropicProvider(apiKey);
      default:
        throw new Error(`Unsupported provider: ${name}`);
    }
  }
}
