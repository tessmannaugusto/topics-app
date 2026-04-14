"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateScript = void 0;
const generative_ai_1 = require("@google/generative-ai");
const generateScript = async (req, res) => {
    const { name, notes, instructions } = req.body;
    if (!name || !notes) {
        return res.status(400).json({ error: 'Topic name and notes are required.' });
    }
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
    }
    try {
        const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
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
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        res.json({ aiScript: text });
    }
    catch (error) {
        console.error('Error generating script:', error);
        res.status(500).json({ error: 'Failed to generate script: ' + error.message });
    }
};
exports.generateScript = generateScript;
