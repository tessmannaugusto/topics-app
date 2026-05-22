# AWS Serverless Backend Deployment

This project has been migrated to a serverless architecture on AWS.

## Prerequisites
- AWS CLI configured with credentials.
- Terraform installed.
- Node.js installed.

## Deployment Steps

### 1. Build the Lambda ZIPs
Run the bundling script in the `backend` directory:
```bash
cd backend
npm run build:lambda
```
This will create `dist-lambda/*.js` files.

### 2. Deploy Infrastructure
Navigate to the `terraform` directory and apply the configuration:
```bash
cd terraform
terraform init
terraform apply
```
**Note**: Terraform will output 4 Function URLs. Save these!

### 3. Configure Secrets
1. Go to the AWS Console -> Secrets Manager.
2. Find the secret named `topics-backend-ai-keys-dev`.
3. Add the following keys and values:
   - `GEMINI_API_KEY`: Your Google Gemini API Key.
   - `OPENAI_API_KEY`: Your OpenAI API Key (optional).
   - `ANTHROPIC_API_KEY`: Your Anthropic API Key (optional).
   - `GOOGLE_TTS_API_KEY`: Your Google Cloud Key for Speech/TTS.

### 4. Update Frontend
1. Open `frontend/src/config.ts`.
2. Set `USE_SERVERLESS = true`.
3. Paste the URLs from the Terraform output into the `serverless` object.

## Architecture
- **Lambda Functions**: Isolated compute for AI Content, Audio, Transcription, and Topics CRUD.
- **DynamoDB**: Managed NoSQL database for Topic storage.
- **Secrets Manager**: Centralized, secure storage for API keys.
- **Function URLs**: Cost-effective, public HTTPS endpoints for each Lambda.
