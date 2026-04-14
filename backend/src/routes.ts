import { Router } from 'express';
import { generateScript } from './api/generate-script';
import { generateAudio } from './api/generate-audio';
import { validate } from './middleware/validate';
import { generateScriptSchema, generateAudioSchema } from './schemas/api-schemas';

const router = Router();

// Script generation endpoint
router.post('/generate-script', validate(generateScriptSchema), generateScript);

// Audio generation endpoint
router.post('/generate-audio', validate(generateAudioSchema), generateAudio);

export default router;
