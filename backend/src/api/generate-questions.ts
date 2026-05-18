import { Request, Response } from 'express';
import { AiService } from '../lib/ai-providers/ai-service';
import { normalizeConfigs } from '../lib/ai-providers/utils';

export const generateQuestions = async (req: Request, res: Response) => {
  const { name, notes, script, count = 3, apiKey: userApiKey, model: selectedModel, configs } = req.body;

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
      You are a specialized learning assistant. Your task is to generate ${count} open-ended, high-quality questions based on the provided study notes for the topic "${name}".
      
      TOPIC NOTES:
      ${notes}
      
      ${script ? `AI-GENERATED SCRIPT (for additional context):
      ${script}` : ''}
      
      The questions should:
      - Challenge the student's understanding of the core concepts.
      - Encourage active recall of specific facts and relationships.
      - Be clear and concise.
      - NOT be multiple choice; they should be open-ended.

      Return the response STRICTLY as a JSON object with the following format, and NO other text:
      {
        "questions": [
          { "id": "unique-uuid-v4-1", "text": "Question text 1?" },
          { "id": "unique-uuid-v4-2", "text": "Question text 2?" }
        ]
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

    if (!parsedData.questions || !Array.isArray(parsedData.questions)) {
      throw new Error('AI returned invalid question format');
    }

    res.json({ questions: parsedData.questions });
  } catch (error: any) {
    console.error('Error generating questions:', error);
    res.status(500).json({ error: 'Failed to generate questions: ' + error.message });
  }
};
