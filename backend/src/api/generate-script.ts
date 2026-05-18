import { Request, Response } from 'express';
import { AiService } from '../lib/ai-providers/ai-service';
import { normalizeConfigs } from '../lib/ai-providers/utils';

export const generateScript = async (req: Request, res: Response) => {
  const { name, notes, instructions, apiKey: userApiKey, model: selectedModel, configs } = req.body;

  if (!name || !notes) {
    return res.status(400).json({ error: 'Topic name and notes are required.' });
  }

  const finalConfigs = normalizeConfigs(configs, userApiKey, selectedModel);

  if (finalConfigs.length === 0 && !process.env.GEMINI_API_KEY) {
    return res.status(400).json({ error: 'No AI provider configuration provided.' });
  }

  // If no configs and we have a server-side key, add it
  if (finalConfigs.length === 0 && process.env.GEMINI_API_KEY) {
    finalConfigs.push({
      name: 'google',
      apiKey: process.env.GEMINI_API_KEY,
      model: selectedModel || 'gemini-2.5-flash'
    });
  }

  try {
    const prompt = `
      You are a Professional Educator and Audiobook Narrator. 
      Your task is to transform the following study notes into an engaging, narrative "audiobook-style" script.
      
      TOPIC: ${name}
      NOTES: ${notes}
      
      ${instructions ? `ADDITIONAL USER INSTRUCTIONS FOR REGENERATION:
      ${instructions}` : ''}
      
      GUIDELINES:
      - Use a conversational, educational tone.
      - Avoid bullet points; use smooth transitions between ideas.
      - Incorporate practical examples to clarify complex concepts.
      - The output should be strictly text, optimized for text-to-speech. 
      - Do NOT use markdown formatting (like **bold** or *italics*) or other symbols.
      - Ensure the script is easy to follow when heard, not just read.
    `;

    const text = await AiService.generateWithFallback({ prompt, configs: finalConfigs });

    res.json({ aiScript: text });
  } catch (error: any) {
    console.error('Error generating script:', error);
    res.status(500).json({ error: 'Failed to generate script: ' + error.message });
  }
};
