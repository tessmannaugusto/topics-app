# AI Evaluation & Feedback Tasks

## Backend Tasks

- [ ] **Task AEF-1: Create Evaluation Schema**
    - **What**: Add `evaluateAnswerSchema` to `backend/src/schemas/api-schemas.ts`.
    - **Done when**: Zod schema for `question`, `userAnswer`, and `notes` is defined.
    - **Verification**: `npm run build` in backend passes.

- [ ] **Task AEF-2: Implement Evaluation Endpoint**
    - **What**: Create `backend/src/api/evaluate-answer.ts` and register it in `backend/src/routes.ts`.
    - **Done when**: Endpoint returns an evaluation with `status` and `feedback`.
    - **Verification**: Test with `curl` or Postman to ensure valid evaluation object.

## Frontend Tasks

- [ ] **Task AEF-3: Implement Evaluation Trigger**
    - **What**: Add a button to "Evaluate Answer" and call the `/api/evaluate-answer` endpoint.
    - **Done when**: Clicking "Evaluate" sends the user's answer and topic notes to the backend.
    - **Verification**: API call occurs when requested.

- [ ] **Task AEF-4: Persist Evaluation Results**
    - **What**: Store the evaluation result in `topic.questions[i].evaluation` in `AsyncStorage`.
    - **Done when**: Evaluation results persist across navigation.
    - **Verification**: Reload topic detail to confirm saved evaluation.

- [ ] **Task AEF-5: Build Evaluation Display UI**
    - **What**: Show the status (Correct/Partial/Incorrect) and detailed feedback in the `QuestionSection`.
    - **Done when**: User sees feedback on their answer after clicking "Evaluate".
    - **Verification**: Visual check in the app/emulator.

- [ ] **Task AEF-6: Add "Try Again" Functionality**
    - **What**: Allow users to clear their answer and evaluation to try again.
    - **Done when**: Clicking "Try Again" clears the `answer` and `evaluation` fields.
    - **Verification**: UI resets for the current question.
