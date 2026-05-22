import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import speech from '@google-cloud/speech';
import { success, error } from '../lib/lambda-utils';
import { validate } from '../middleware/lambda-validate';
import { transcribeSchema } from '../schemas/api-schemas';

const getClient = (userApiKey?: string) => {
  const apiKey = userApiKey || process.env.GOOGLE_TTS_API_KEY;
  if (!apiKey) {
    throw new Error('Google Cloud API Key is not configured. Please provide it in Settings.');
  }
  return new speech.SpeechClient({
    apiKey: apiKey,
  });
};

const baseHandler = async (_event: APIGatewayProxyEvent, body: any): Promise<APIGatewayProxyResult> => {
  const { audioContent, platform, apiKey: userApiKey } = body;

  try {
    const speechClient = getClient(userApiKey);
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

    return success({ transcript: transcript || '' });
  } catch (err: any) {
    console.error('Error transcribing audio:', err);
    return error(500, 'Failed to transcribe audio: ' + err.message);
  }
};

export const handler = validate(transcribeSchema)(baseHandler);
