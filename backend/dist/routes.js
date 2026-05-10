"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const generate_script_1 = require("./api/generate-script");
const generate_audio_1 = require("./api/generate-audio");
const transcribe_1 = require("./api/transcribe");
const generate_questions_1 = require("./api/generate-questions");
const evaluate_answer_1 = require("./api/evaluate-answer");
const validate_1 = require("./middleware/validate");
const api_schemas_1 = require("./schemas/api-schemas");
const router = (0, express_1.Router)();
// API Routes
router.post('/generate-script', (0, validate_1.validate)(api_schemas_1.generateScriptSchema), generate_script_1.generateScript);
router.post('/generate-audio', (0, validate_1.validate)(api_schemas_1.generateAudioSchema), generate_audio_1.generateAudio);
router.post('/transcribe', (0, validate_1.validate)(api_schemas_1.transcribeSchema), transcribe_1.transcribe);
router.post('/generate-questions', (0, validate_1.validate)(api_schemas_1.generateQuestionsSchema), generate_questions_1.generateQuestions);
router.post('/evaluate-answer', (0, validate_1.validate)(api_schemas_1.evaluateAnswerSchema), evaluate_answer_1.evaluateAnswer);
exports.default = router;
