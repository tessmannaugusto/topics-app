import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { z } from 'zod';
import { error, parseBody } from '../lib/lambda-utils';
import { getSecrets } from '../lib/secrets';

export const validate = (schema: z.ZodType<any, any, any>) => {
  return (handler: (event: APIGatewayProxyEvent, body: any) => Promise<APIGatewayProxyResult>) => {
    return async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
      // Pre-fetch secrets if needed
      if (process.env.AI_KEYS_SECRET_ID) {
        const secrets = await getSecrets(process.env.AI_KEYS_SECRET_ID);
        const keys = ['GEMINI_API_KEY', 'OPENAI_API_KEY', 'ANTHROPIC_API_KEY', 'GOOGLE_TTS_API_KEY'];
        keys.forEach(key => {
          if (secrets[key] && !process.env[key]) {
            process.env[key] = secrets[key];
          }
        });
      }

      const body = parseBody(event);
      const result = schema.safeParse(body);
      
      if (!result.success) {
        const errorMessage = result.error.issues
          .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
          .join(', ');
        return error(400, `Validation failed: ${errorMessage}`);
      }
      
      // Pass the validated body to the handler to avoid double parsing
      return handler(event, result.data);
    };
  };
};
