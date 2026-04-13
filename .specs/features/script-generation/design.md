# AI Script Generation Design

## Architecture Overview

The system will use a client-server architecture to ensure security for API keys and to offload heavy processing.

- **Frontend (React Native/Expo)**:
    - User initiates script generation.
    - Sends topic notes to the backend.
    - Receives and stores the generated script.
    - Displays the script to the user.
- **Backend (Node.js/Express)**:
    - Receives notes from the mobile app.
    - Calls the AI API (OpenAI or Gemini) with a specific prompt.
    - Returns the formatted script.
    - (Future) Could also handle TTS proxying.

## AI Model & Prompting

**Model Choice**: Gemini 1.5 Flash (Fast and cost-effective) or OpenAI GPT-4o-mini.

**System Prompt Strategy**:
The AI will be instructed to act as a "Professional Educator and Audiobook Narrator".
Key instructions:
- Use a narrative, conversational style.
- Avoid bullet points; use transitions like "Furthermore", "On the other hand", "A great example of this is...".
- Integrate practical examples directly into the flow.
- Ensure the output is strictly text (no markdown formatting like bold/italics, as it might confuse TTS).

## API Endpoints

### `POST /api/generate-script`
- **Request Body**: `{ "id": string, "name": string, "notes": string }`
- **Response Body**: `{ "aiScript": string }`
- **Authentication**: (v1: Simple API Key or none if internal-only).

## Data Flow

1. User clicks "Generate Script" on `TopicDetail` screen.
2. App sends `notes` to `POST /api/generate-script`.
3. Backend calls AI with: `System Prompt + Topic Name + Notes`.
4. AI returns the script.
5. Backend returns script to App.
6. App updates `Topic` in `AsyncStorage` and re-renders.

## Security Considerations

- API Keys for OpenAI/Gemini will be stored in backend environment variables.
- Backend will be protected by a simple header check for the MVP.

## Future Considerations

- **Streaming**: For very long scripts, we might want to stream the response.
- **Multiple Personas**: Allow the user to choose "Energetic", "Formal", or "Casual" tones.
