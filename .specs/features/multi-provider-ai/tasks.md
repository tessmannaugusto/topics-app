# Multi-provider AI Integration Tasks

## Phase 1: Storage & Types (Frontend)
- [x] [T1] Update `UserConfig` interface in `frontend/src/storage/topic-storage.ts` to support multiple providers. [FR-9]
- [x] [T2] Implement migration logic in `getUserConfig` to move old Gemini settings to the new structure. [FR-10]

## Phase 2: Backend Provider Abstraction & Fallback logic
- [x] [T3] Install `openai` and `@anthropic-ai/sdk` in the backend.
- [x] [T4] Create `LlmProvider` interface and `LlmProviderFactory`. [FR-7]
- [x] [T5] Implement `GoogleProvider`, `OpenAIProvider`, and `AnthropicProvider`.
- [x] [T6] Create `AiService` orchestrator with retry and fallback logic (model-level and provider-level). [FR-8, FR-11, FR-12]

## Phase 3: Backend Endpoint Updates
- [x] [T7] Update `/api/generate-questions` to use `AiService` and accept multiple config objects. [FR-6]
- [x] [T8] Update `/api/generate-script` to use `AiService` and accept multiple config objects. [FR-6]
- [x] [T9] Update `/api/evaluate-answer` to use `AiService` and accept multiple config objects. [FR-6]

## Phase 4: Frontend Configuration UI
- [x] [T10] Redesign `frontend/app/config.tsx` to handle multiple provider API keys and default selection. [FR-1, FR-2, FR-3, FR-4, FR-5]

## Phase 5: Component Integration
- [x] [T11] Update `TopicInteractive.tsx` to pass all available provider configs to the backend.
- [x] [T12] Update `TopicAudiobook.tsx` to pass all available provider configs to the backend. (Corrected from TopicNotes.tsx)

## Phase 6: Validation
- [x] [T13] Verify primary provider success.
- [x] [T14] Verify model fallback (by temporarily breaking primary model call).
- [x] [T15] Verify provider fallback (by temporarily breaking primary provider key/call).
