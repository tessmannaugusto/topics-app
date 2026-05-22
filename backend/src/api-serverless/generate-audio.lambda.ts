import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import textToSpeech from '@google-cloud/text-to-speech';
import { error } from '../lib/lambda-utils';
import { validate } from '../middleware/lambda-validate';
import { generateAudioSchema } from '../schemas/api-schemas';

const getClient = (userApiKey?: string) => {
  const apiKey = userApiKey || process.env.GOOGLE_TTS_API_KEY;
  if (!apiKey) {
    throw new Error('Google Cloud TTS API Key is not configured. Please provide it in Settings.');
  }
  return new textToSpeech.TextToSpeechClient({
    apiKey: apiKey,
  });
};

const baseHandler = async (_event: APIGatewayProxyEvent, body: any): Promise<APIGatewayProxyResult> => {
  const { id, script, apiKey: userApiKey } = body;

  try {
    const ttsClient = getClient(userApiKey);
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

    const audioBase64 = Buffer.from(response.audioContent as Uint8Array).toString('base64');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Access-Control-Allow-Origin': '*',
      },
      body: audioBase64,
      isBase64Encoded: true,
    };
  } catch (err: any) {
    console.error('Error generating audio:', err);
    return error(500, 'Failed to generate audio: ' + err.message);
  }
};

export const handler = validate(generateAudioSchema)(baseHandler);
