import { Router } from 'express';
import { generateScript } from './api/generate-script';
import { generateAudio } from './api/generate-audio';
import { transcribe } from './api/transcribe';
import { generateQuestions } from './api/generate-questions';
import { signup, login } from './api/auth';
import { validate } from './middleware/validate';
import { authenticate } from './middleware/auth';
import { generateScriptSchema, generateAudioSchema, transcribeSchema, generateQuestionsSchema } from './schemas/api-schemas';

const router = Router();

// Auth endpoints
router.post('/signup', signup);
router.post('/login', login);

// Protected API Routes
router.post('/generate-script', authenticate, validate(generateScriptSchema), generateScript);
router.post('/generate-audio', authenticate, validate(generateAudioSchema), generateAudio);
router.post('/transcribe', authenticate, validate(transcribeSchema), transcribe);
router.post('/generate-questions', authenticate, validate(generateQuestionsSchema), generateQuestions);

export default router;
