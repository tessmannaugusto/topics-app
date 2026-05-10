# Tasks: Local Storage Consolidation (DB Removal)

## Phase 1: Backend Cleanup
- [x] **TSK-1: Delete Database Files**
  - Delete `backend/prisma/`
  - Delete `backend/prisma.config.ts`
  - Delete `backend/dev.db`
  - Delete `backend/src/lib/prisma.ts`
  - Delete `backend/src/generated/` (if present)
  - **Done when:** `ls` in backend shows no prisma/db files.
- [x] **TSK-2: Uninstall Dependencies**
  - Run `npm uninstall @prisma/client @prisma/adapter-pg pg`
  - Run `npm uninstall -D prisma @types/pg`
  - **Done when:** `package.json` is updated and dependencies are gone.
- [x] **TSK-3: Clean Environment Variables**
  - Remove `DATABASE_URL` from `backend/.env`.
  - **Done when:** `.env` is clean.

## Phase 2: Frontend Verification
- [x] **TSK-4: Align Data Models**
  - Verify `Topic` and `Question` interfaces in `frontend/src/storage/topic-storage.ts`.
  - Ensure `Question` has an `evaluation` field as seen in the Prisma schema.
  - **Done when:** Types match functional requirements.

## Phase 3: Verification
- [x] **TSK-5: Backend Smoke Test**
  - Run `npm run start` in `backend`.
  - **Done when:** Server is listening without errors.
- [x] **TSK-6: End-to-End Persistence Check**
  - Manually verify creating, editing, and deleting topics/folders in the frontend.
  - **Done when:** Data persists after app reload.
