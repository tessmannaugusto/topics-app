import { Router } from 'express';
import { generateScript } from './api/generate-script';
import { generateAudio } from './api/generate-audio';
import { transcribe } from './api/transcribe';
import { generateQuestions } from './api/generate-questions';
import { evaluateAnswer } from './api/evaluate-answer';
import { validate } from './middleware/validate';
import { 
  generateScriptSchema, 
  generateAudioSchema, 
  transcribeSchema, 
  generateQuestionsSchema,
  evaluateAnswerSchema
} from './schemas/api-schemas';

const router = Router();

// API Routes
router.post('/generate-script', validate(generateScriptSchema), generateScript);
router.post('/generate-audio', validate(generateAudioSchema), generateAudio);
router.post('/transcribe', validate(transcribeSchema), transcribe);
router.post('/generate-questions', validate(generateQuestionsSchema), generateQuestions);
router.post('/evaluate-answer', validate(evaluateAnswerSchema), evaluateAnswer);

export default router;
