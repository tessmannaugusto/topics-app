import { z } from 'zod';

export const providerConfigSchema = z.object({
  name: z.enum(['google', 'openai', 'anthropic']),
  apiKey: z.string().min(1, "API Key cannot be empty"),
  model: z.string().optional(),
});

export const generateScriptSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Topic name cannot be empty"),
    notes: z.string().min(1, "Notes cannot be empty"),
    instructions: z.string().optional(),
    apiKey: z.string().optional(),
    model: z.string().optional(),
    configs: z.array(providerConfigSchema).optional(),
  }),
});

export const generateAudioSchema = z.object({
  body: z.object({
    id: z.string().min(1, "Topic ID cannot be empty"),
    script: z.string().min(1, "Script cannot be empty"),
    apiKey: z.string().optional(),
  }),
});

export const transcribeSchema = z.object({
  body: z.object({
    audioContent: z.string().min(1, "Audio content cannot be empty"),
    platform: z.enum(['android', 'ios', 'web']).optional(),
    apiKey: z.string().optional(),
  }),
});

export const generateQuestionsSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Topic name cannot be empty"),
    notes: z.string().min(1, "Notes cannot be empty"),
    script: z.string().optional(),
    count: z.number().min(1).max(10).optional().default(3),
    apiKey: z.string().optional(),
    model: z.string().optional(),
    configs: z.array(providerConfigSchema).optional(),
  }),
});

export const evaluateAnswerSchema = z.object({
  body: z.object({
    question: z.string().min(1, "Question cannot be empty"),
    answer: z.string().min(1, "Answer cannot be empty"),
    notes: z.string().min(1, "Notes cannot be empty"),
    apiKey: z.string().optional(),
    model: z.string().optional(),
    configs: z.array(providerConfigSchema).optional(),
  }),
});
