import { Request, Response } from 'express';
import speech from '@google-cloud/speech';

let client: any = null;

const getClient = () => {
  if (!client) {
    const apiKey = process.env.GOOGLE_TTS_API_KEY; // Reusing the same key
    if (!apiKey) {
      throw new Error('GOOGLE_TTS_API_KEY is not configured on the server.');
    }
    client = new speech.SpeechClient({
      apiKey: apiKey,
    });
  }
  return client;
};

export const transcribe = async (req: Request, res: Response) => {
  const { audioContent, platform } = req.body;

  if (!audioContent) {
    return res.status(400).json({ error: 'Audio content is required.' });
  }

  try {
    const speechClient = getClient();

    // Configure based on platform
    // iOS (expo-av LINEARPCM) -> LINEAR16, 16000Hz
    // Android (expo-av AMR_WB) -> AMR_WB, 16000Hz
    const encoding = platform === 'android' ? 'AMR_WB' : 'LINEAR16';
    
    const request = {
      audio: {
        content: audioContent,
      },
      config: {
        encoding: encoding as any,
        sampleRateHertz: 16000,
        languageCode: 'en-US',
      },
    };

    const [response] = await speechClient.recognize(request);
    
    const transcript = response.results
      ?.map((result: any) => result.alternatives[0].transcript)
      .join('\n');

    res.json({ transcript: transcript || '' });
  } catch (error: any) {
    console.error('Error transcribing audio:', error);
    res.status(500).json({ error: 'Failed to transcribe audio: ' + error.message });
  }
};
