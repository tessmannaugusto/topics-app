# AI Question Generator Tasks

## Data Layer Tasks

- [ ] **Task AQG-1: Update Topic Schema**
    - **What**: Add `Question` and `Evaluation` interfaces and update the `Topic` interface in `frontend/src/storage/topic-storage.ts`.
    - **Done when**: `Topic` interface includes `questions?: Question[]`.
    - **Verification**: TypeScript compiles without errors in storage and usage files.

## Backend Tasks

- [ ] **Task AQG-2: Create Question Generation Schema**
    - **What**: Add `generateQuestionsSchema` to `backend/src/schemas/api-schemas.ts`.
    - **Done when**: Zod schema for `name`, `notes`, `script`, and `count` is defined.
    - **Verification**: `npm run build` in backend passes.

- [ ] **Task AQG-3: Implement Question Generation Endpoint**
    - **What**: Create `backend/src/api/generate-questions.ts` and register it in `backend/src/routes.ts`.
    - **Done when**: Endpoint returns a structured JSON list of questions from Gemini.
    - **Verification**: Test with `curl` or Postman to ensure JSON format is correct.

## Frontend Tasks

- [ ] **Task AQG-4: Implement Question Generation Logic**
    - **What**: Add a function in the UI (or a new storage helper) to call the `/api/generate-questions` endpoint and update the local topic state.
    - **Done when**: Clicking a button triggers the API call and saves questions to `AsyncStorage`.
    - **Verification**: Console logs show questions being received and saved.

- [ ] **Task AQG-5: Build Question Display UI**
    - **What**: Create a `QuestionSection` component in `app/[id].tsx` that displays questions one by one with navigation (Next/Prev).
    - **Done when**: User can cycle through generated questions.
    - **Verification**: Visual check in the app/emulator.

- [ ] **Task AQG-6: Add "Regenerate" Functionality**
    - **What**: Add a button to clear existing questions and generate a new set.
    - **Done when**: Clicking "Regenerate" replaces the `questions` array in the topic.
    - **Verification**: UI updates with new questions.
