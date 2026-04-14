"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const generate_script_1 = require("./api/generate-script");
const generate_audio_1 = require("./api/generate-audio");
const validate_1 = require("./middleware/validate");
const api_schemas_1 = require("./schemas/api-schemas");
const router = (0, express_1.Router)();
// Script generation endpoint
router.post('/generate-script', (0, validate_1.validate)(api_schemas_1.generateScriptSchema), generate_script_1.generateScript);
// Audio generation endpoint
router.post('/generate-audio', (0, validate_1.validate)(api_schemas_1.generateAudioSchema), generate_audio_1.generateAudio);
exports.default = router;
