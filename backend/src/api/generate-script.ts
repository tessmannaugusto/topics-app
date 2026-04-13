import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const generateScript = async (req: Request, res: Response) => {
  const { name, notes } = req.body;

  if (!name || !notes) {
    return res.status(400).json({ error: 'Topic name and notes are required.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
      You are a Professional Educator and Audiobook Narrator. 
      Your task is to transform the following study notes into an engaging, narrative "audiobook-style" script.
      
      TOPIC: ${name}
      NOTES: ${notes}
      
      GUIDELINES:
      - Use a conversational, educational tone.
      - Avoid bullet points; use smooth transitions between ideas.
      - Incorporate practical examples to clarify complex concepts.
      - The output should be strictly text, optimized for text-to-speech. 
      - Do NOT use markdown formatting (like **bold** or *italics*) or other symbols.
      - Ensure the script is easy to follow when heard, not just read.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ aiScript: text });
  } catch (error: any) {
    console.error('Error generating script:', error);
    res.status(500).json({ error: 'Failed to generate script: ' + error.message });
  }
};
