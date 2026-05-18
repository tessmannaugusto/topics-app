"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateScript = void 0;
const ai_service_1 = require("../lib/ai-providers/ai-service");
const utils_1 = require("../lib/ai-providers/utils");
const generateScript = async (req, res) => {
    const { name, notes, instructions, apiKey: userApiKey, model: selectedModel, configs } = req.body;
    if (!name || !notes) {
        return res.status(400).json({ error: 'Topic name and notes are required.' });
    }
    const finalConfigs = (0, utils_1.normalizeConfigs)(configs, userApiKey, selectedModel);
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
        const text = await ai_service_1.AiService.generateWithFallback({ prompt, configs: finalConfigs });
        res.json({ aiScript: text });
    }
    catch (error) {
        console.error('Error generating script:', error);
        res.status(500).json({ error: 'Failed to generate script: ' + error.message });
    }
};
exports.generateScript = generateScript;
