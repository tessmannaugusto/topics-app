import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const generateQuestions = async (req: Request, res: Response) => {
  const { name, notes, script, count = 3 } = req.body;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

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

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

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
