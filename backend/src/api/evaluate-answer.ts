import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const evaluateAnswer = async (req: Request, res: Response) => {
  const { question, answer, notes, apiKey: userApiKey, model: selectedModel } = req.body;

  const apiKey = userApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API Key is not configured. Please provide it in Settings.' });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: selectedModel || 'gemini-2.5-flash' });

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
