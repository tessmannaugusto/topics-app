import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { AiService } from '../lib/ai-providers/ai-service';
import { normalizeConfigs } from '../lib/ai-providers/utils';
import { success, error } from '../lib/lambda-utils';
import { getSecrets } from '../lib/secrets';
import { 
  generateQuestionsSchema, 
  generateScriptSchema, 
  evaluateAnswerSchema 
} from '../schemas/api-schemas';

const baseHandler = async (event: APIGatewayProxyEvent, body: any): Promise<APIGatewayProxyResult> => {
  const path = event.path || (event as any).requestContext?.http?.path || '';

  try {
    if (path.includes('generate-questions')) {
      const validBody = generateQuestionsSchema.parse(body);
      return await handleGenerateQuestions(validBody);
    } else if (path.includes('generate-script')) {
      const validBody = generateScriptSchema.parse(body);
      return await handleGenerateScript(validBody);
    } else if (path.includes('evaluate-answer')) {
      const validBody = evaluateAnswerSchema.parse(body);
      return await handleEvaluateAnswer(validBody);
    } else {
      return error(404, `Route ${path} not found in AI Content Lambda`);
    }
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return error(400, `Validation failed: ${err.issues.map((e: any) => e.message).join(', ')}`);
    }
    console.error('AI Content Error:', err);
    return error(500, err.message);
  }
};

// Since this Lambda handles multiple routes, we don't use the top-level validate wrapper
// but rather validate inside based on the path.
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Pre-fetch secrets if needed
  if (process.env.AI_KEYS_SECRET_ID) {
    const secrets = await getSecrets(process.env.AI_KEYS_SECRET_ID);
    const keys = ['GEMINI_API_KEY', 'OPENAI_API_KEY', 'ANTHROPIC_API_KEY', 'GOOGLE_TTS_API_KEY'];
    keys.forEach(key => {
      if (secrets[key] && !process.env[key]) {
        process.env[key] = secrets[key];
      }
    });
  }

  const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body || {};
  return baseHandler(event, body);
};

async function handleGenerateQuestions(body: any) {
  const { name, notes, script, count = 3, apiKey: userApiKey, model: selectedModel, configs } = body;
  const finalConfigs = getConfigs(configs, userApiKey, selectedModel);

  const prompt = `
    You are a specialized learning assistant. Your task is to generate ${count} open-ended, high-quality questions based on the provided study notes for the topic "${name}".
    TOPIC NOTES: ${notes}
    ${script ? `AI-GENERATED SCRIPT (for additional context): ${script}` : ''}
    Return the response STRICTLY as a JSON object:
    { "questions": [ { "id": "uuid", "text": "Question?" } ] }
  `;

  const text = await AiService.generateWithFallback({ prompt, configs: finalConfigs });
  return success(parseJson(text));
}

async function handleGenerateScript(body: any) {
  const { name, notes, instructions, apiKey: userApiKey, model: selectedModel, configs } = body;
  const finalConfigs = getConfigs(configs, userApiKey, selectedModel);

  const prompt = `
    You are a Professional Educator. Transform the notes into a narrative audiobook-style script.
    TOPIC: ${name}
    NOTES: ${notes}
    ${instructions ? `ADDITIONAL INSTRUCTIONS: ${instructions}` : ''}
    Output strictly text optimized for TTS, no markdown.
  `;

  const text = await AiService.generateWithFallback({ prompt, configs: finalConfigs });
  return success({ aiScript: text });
}

async function handleEvaluateAnswer(body: any) {
  const { question, answer, notes, apiKey: userApiKey, model: selectedModel, configs } = body;
  const finalConfigs = getConfigs(configs, userApiKey, selectedModel);

  const prompt = `
    Evaluate the student's answer based on the notes.
    NOTES: ${notes}
    QUESTION: ${question}
    ANSWER: ${answer}
    Return strictly JSON: { "status": "correct"|"partial"|"incorrect", "feedback": "..." }
  `;

  const text = await AiService.generateWithFallback({ prompt, configs: finalConfigs });
  return success(parseJson(text));
}

function getConfigs(configs: any, userApiKey: string, selectedModel: string) {
  const final = normalizeConfigs(configs, userApiKey, selectedModel);
  if (final.length === 0 && process.env.GEMINI_API_KEY) {
    final.push({
      name: 'google',
      apiKey: process.env.GEMINI_API_KEY,
      model: selectedModel || 'gemini-2.5-flash'
    });
  }
  return final;
}

function parseJson(text: string) {
  let cleaned = text;
  if (cleaned.includes('```json')) {
    cleaned = cleaned.split('```json')[1].split('```')[0].trim();
  } else if (cleaned.includes('```')) {
    cleaned = cleaned.split('```')[1].split('```')[0].trim();
  }
  return JSON.parse(cleaned);
}
