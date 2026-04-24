"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAudio = void 0;
const text_to_speech_1 = __importDefault(require("@google-cloud/text-to-speech"));
let client = null;
const getClient = () => {
    if (!client) {
        const apiKey = process.env.GOOGLE_TTS_API_KEY;
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY is not configured on the server.');
        }
        client = new text_to_speech_1.default.TextToSpeechClient({
            apiKey: apiKey,
        });
    }
    return client;
};
const generateAudio = async (req, res) => {
    const { id, script } = req.body;
    if (!id || !script) {
        return res.status(400).json({ error: 'Topic ID and script are required.' });
    }
    try {
        const ttsClient = getClient();
        const request = {
            input: { text: script },
            voice: {
                languageCode: 'en-US',
                name: 'en-US-Journey-F',
            },
            audioConfig: { audioEncoding: 'MP3' },
        };
        const [response] = await ttsClient.synthesizeSpeech(request);
        if (!response.audioContent) {
            throw new Error('No audio content received from Google Cloud TTS');
        }
        res.set('Content-Type', 'audio/mpeg');
        res.send(response.audioContent);
    }
    catch (error) {
        console.error('Error generating audio:', error);
        res.status(500).json({ error: 'Failed to generate audio: ' + error.message });
    }
};
exports.generateAudio = generateAudio;
