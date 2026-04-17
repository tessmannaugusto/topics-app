import { Router } from 'express';
import { generateScript } from './api/generate-script';
import { generateAudio } from './api/generate-audio';
import { transcribe } from './api/transcribe';
import { validate } from './middleware/validate';
import { generateScriptSchema, generateAudioSchema, transcribeSchema } from './schemas/api-schemas';

const router = Router();

// Script generation endpoint
router.post('/generate-script', validate(generateScriptSchema), generateScript);

// Audio generation endpoint
router.post('/generate-audio', validate(generateAudioSchema), generateAudio);

// Transcription endpoint
router.post('/transcribe', validate(transcribeSchema), transcribe);

export default router;
