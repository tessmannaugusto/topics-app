"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const generate_script_1 = require("./api/generate-script");
const generate_audio_1 = require("./api/generate-audio");
const transcribe_1 = require("./api/transcribe");
const generate_questions_1 = require("./api/generate-questions");
const auth_1 = require("./api/auth");
const validate_1 = require("./middleware/validate");
const auth_2 = require("./middleware/auth");
const api_schemas_1 = require("./schemas/api-schemas");
const router = (0, express_1.Router)();
// Auth endpoints
router.post('/signup', auth_1.signup);
router.post('/login', auth_1.login);
// Protected API Routes
router.post('/generate-script', auth_2.authenticate, (0, validate_1.validate)(api_schemas_1.generateScriptSchema), generate_script_1.generateScript);
router.post('/generate-audio', auth_2.authenticate, (0, validate_1.validate)(api_schemas_1.generateAudioSchema), generate_audio_1.generateAudio);
router.post('/transcribe', auth_2.authenticate, (0, validate_1.validate)(api_schemas_1.transcribeSchema), transcribe_1.transcribe);
router.post('/generate-questions', auth_2.authenticate, (0, validate_1.validate)(api_schemas_1.generateQuestionsSchema), generate_questions_1.generateQuestions);
exports.default = router;
