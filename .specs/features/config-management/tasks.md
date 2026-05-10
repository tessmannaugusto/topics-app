# Tasks: Config Enhancements

## Phase 1: Frontend Infrastructure & Storage
- [ ] CONF-T1: Update `UserConfig` interface in `frontend/src/storage/topic-storage.ts` to include `selectedModel`.
- [ ] CONF-T2: Update `getUserConfig` and `saveTopic` (if needed) or add a specific `saveUserConfig` helper in `frontend/src/storage/topic-storage.ts`.

## Phase 2: Frontend UI
- [ ] CONF-T3: Add global Gear icon in `frontend/app/_layout.tsx` header (Right side).
- [ ] CONF-T4: Implement Model selection dropdown in `frontend/app/config.tsx`.
- [ ] CONF-T5: Update `handleSave` in `frontend/app/config.tsx` to persist the selected model.

## Phase 3: Backend Updates
- [ ] CONF-T6: Update Zod schemas in `backend/src/schemas/api-schemas.ts` to include optional `model`.
- [ ] CONF-T7: Update `backend/src/api/generate-script.ts` to use the passed `model`.
- [ ] CONF-T8: Update `backend/src/api/generate-questions.ts` to use the passed `model`.
- [ ] CONF-T9: Update `backend/src/api/evaluate-answer.ts` to use the passed `model`.

## Phase 4: Integration & Verification
- [ ] CONF-T10: Update frontend API calls to pass the `selectedModel`.
- [ ] CONF-T11: Verify model switching works by checking backend logs or behavior differences (if observable).

## Verification Criteria
- Gear icon appears on Home, Topic Detail, and Folder pages.
- Clicking Gear icon navigates to Settings.
- Settings page shows a dropdown with Gemini models.
- Changing model and saving persists the choice (re-entering page shows correct model).
- AI requests succeed and respect the selected model.
