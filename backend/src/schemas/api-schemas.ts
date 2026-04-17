import { z } from 'zod';

export const generateScriptSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Topic name cannot be empty"),
    notes: z.string().min(1, "Notes cannot be empty"),
    instructions: z.string().optional(),
  }),
});

export const generateAudioSchema = z.object({
  body: z.object({
    id: z.string().min(1, "Topic ID cannot be empty"),
    script: z.string().min(1, "Script cannot be empty"),
  }),
});

export const transcribeSchema = z.object({
  body: z.object({
    audioContent: z.string().min(1, "Audio content cannot be empty"),
    platform: z.enum(['android', 'ios', 'web']).optional(),
  }),
});
