# Tasks: Configuration & API Key Management

## Frontend Implementation (MVP)

- [x] **T1: Create Config Screen UI**
  - [x] Create `frontend/app/config.tsx`.
  - [x] Implement form with Gemini API Key input (secure entry).
  - [x] Add "Save Changes" button.
  - [x] Handle loading and error states.
  - [x] Show masked key if already set.
- [x] **T2: Navigation Integration**
  - [x] Add gear icon to `frontend/app/index.tsx` header.
  - [x] Link gear icon to `/config` route.
  - [x] Register `config` screen in `frontend/app/_layout.tsx`.
- [x] **T3: API Integration**
  - [x] Implement `fetchConfig` to call `GET /api/user/config`.
  - [x] Implement `updateConfig` to call `PATCH /api/user/config`.
  - [x] Ensure requests include Auth token from `AuthContext`.

## Backend Implementation (Out of Scope for this task)

- [ ] **B1: Database Update**
  - Update Prisma schema with configuration fields.
  - Run migrations.
- [ ] **B2: Encryption Utility**
  - Implement encryption/decryption service.
- [ ] **B3: API Endpoints**
  - Implement `GET /api/user/config` (returning masked key).
  - Implement `PATCH /api/user/config` (encrypting and saving raw key).
- [ ] **B4: AI Proxy Integration**
  - Update AI generation routes to use the user's decrypted API key from DB instead of environment variables.
