# Multi-provider AI Integration Spec

Allow users to switch between different AI providers (Google, OpenAI, Anthropic) for LLM-based tasks and store their API keys locally in the frontend.

## Requirements

### 1. Provider Configuration (Frontend)
- [FR-1] Implement a settings UI to manage multiple AI providers.
- [FR-2] Supported providers: Google Gemini, OpenAI, Anthropic.
- [FR-3] Store API keys for each provider in local storage (`AsyncStorage`).
- [FR-4] Allow selecting a default provider and model.
- [FR-5] Mask API keys in the UI after saving.

### 2. Provider Switching & Fallback (Backend)
- [FR-6] Update backend LLM endpoints to accept a prioritized list of provider configurations.
- [FR-7] Implement provider-specific adapters/logic for:
    - `generate-questions.ts`
    - `generate-script.ts`
    - `evaluate-answer.ts`
- [FR-8] Implement Model Fallback: If a preferred model fails, automatically retry with a more efficient/reliable model within the same provider.
- [FR-11] Implement Provider Fallback: If a provider fails (e.g., rate limit, service down), automatically retry with the next available provider in the user's configuration.
- [FR-12] Ensure retries are seamless to the user (frontend receives a successful response from the fallback).
- [FR-8] Supported models initially:
    - Google: `gemini-2.5-flash` (Primary), `gemini-1.5-flash` (Fallback)
    - OpenAI: `gpt-4o` (Primary), `gpt-4o-mini` (Fallback)
    - Anthropic: `claude-3-5-sonnet-20240620` (Primary), `claude-3-haiku-20240307` (Fallback)


### 3. Data Integration
- [FR-9] Update `UserConfig` storage schema to accommodate multiple keys and preferences.
- [FR-10] Ensure backward compatibility with existing single-key (Gemini) configuration.

## Technical Constraints
- API keys MUST be stored in the frontend and passed to the backend in each request.
- Backend should not store user API keys.
- Use official SDKs where appropriate (or standard REST calls).

## Verification Criteria
- User can save multiple API keys in the Settings page.
- User can select OpenAI and generate questions successfully.
- User can select Anthropic and generate a script successfully.
- User can select Google and evaluate an answer successfully.
- Existing Gemini-only configurations continue to work or are migrated smoothly.
