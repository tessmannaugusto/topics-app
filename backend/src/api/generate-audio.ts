import { Request, Response } from 'express';
import textToSpeech from '@google-cloud/text-to-speech';

let client: any = null;

const getClient = () => {
  if (!client) {
    const apiKey = process.env.GOOGLE_TTS_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured on the server.');
    }
    client = new textToSpeech.TextToSpeechClient({
      apiKey: apiKey,
    });
  }
  return client;
};

export const generateAudio = async (req: Request, res: Response) => {
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
      audioConfig: { audioEncoding: 'MP3' as const },
    };

    const [response] = await ttsClient.synthesizeSpeech(request);

    if (!response.audioContent) {
      throw new Error('No audio content received from Google Cloud TTS');
    }

    res.set('Content-Type', 'audio/mpeg');
    res.send(response.audioContent);
  } catch (error: any) {
    console.error('Error generating audio:', error);
    res.status(500).json({ error: 'Failed to generate audio: ' + error.message });
  }
};
