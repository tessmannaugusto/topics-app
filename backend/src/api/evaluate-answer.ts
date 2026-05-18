import { Request, Response } from 'express';
import { AiService } from '../lib/ai-providers/ai-service';
import { normalizeConfigs } from '../lib/ai-providers/utils';

export const evaluateAnswer = async (req: Request, res: Response) => {
  const { question, answer, notes, apiKey: userApiKey, model: selectedModel, configs } = req.body;

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
      You are a specialized learning assistant. Your task is to evaluate a student's answer to a specific question based on provided study notes.
      
      STUDY NOTES:
      ${notes}
      
      QUESTION:
      ${question}
      
      STUDENT'S ANSWER:
      ${answer}
      
      Instructions:
      1. Determine the status of the answer: 'correct', 'partial', or 'incorrect'.
      2. Provide constructive feedback. If 'partial' or 'incorrect', briefly explain what was missing or wrong based on the study notes.
      3. Be encouraging but accurate.

      Return the response STRICTLY as a JSON object with the following format, and NO other text:
      {
        "status": "correct" | "partial" | "incorrect",
        "feedback": "Constructive feedback here..."
      }
    `;

    let text = await AiService.generateWithFallback({ prompt, configs: finalConfigs });

    // Clean up response if AI included markdown blocks
    if (text.includes('```json')) {
      text = text.split('```json')[1].split('```')[0].trim();
    } else if (text.includes('```')) {
      text = text.split('```')[1].split('```')[0].trim();
    }

    const parsedData = JSON.parse(text);

    if (!parsedData.status || !parsedData.feedback) {
      throw new Error('AI returned invalid evaluation format');
    }

    res.json({ 
      status: parsedData.status,
      feedback: parsedData.feedback
    });
  } catch (error: any) {
    console.error('Error evaluating answer:', error);
    res.status(500).json({ error: 'Failed to evaluate answer: ' + error.message });
  }
};
