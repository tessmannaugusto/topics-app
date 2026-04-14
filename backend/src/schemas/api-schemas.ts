import { z } from 'zod';

export const generateScriptSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Topic name is required",
    }).min(1, "Topic name cannot be empty"),
    notes: z.string({
      required_error: "Notes are required",
    }).min(1, "Notes cannot be empty"),
    instructions: z.string().optional(),
  }),
});

export const generateAudioSchema = z.object({
  body: z.object({
    id: z.string({
      required_error: "Topic ID is required",
    }).min(1, "Topic ID cannot be empty"),
    script: z.string({
      required_error: "Script is required",
    }).min(1, "Script cannot be empty"),
  }),
});
