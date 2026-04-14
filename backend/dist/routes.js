"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const generate_script_1 = require("./api/generate-script");
const generate_audio_1 = require("./api/generate-audio");
const router = (0, express_1.Router)();
// Script generation endpoint
router.post('/generate-script', generate_script_1.generateScript);
// Audio generation endpoint
router.post('/generate-audio', generate_audio_1.generateAudio);
exports.default = router;
