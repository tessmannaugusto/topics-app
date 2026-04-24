# Tasks: Cloud Sync & Auth

## [PHASE-1] Backend Foundation

- [x] [TASK-101] Initialize Prisma
  - Description: Install Prisma, create schema, and perform initial migration.
  - Done when: `npx prisma db pull` (if existing) or `npx prisma migrate dev` works.

- [x] [TASK-102] Implement JWT Auth Endpoints
  - Description: Add Signup and Login endpoints with `bcrypt` and `jsonwebtoken`.
  - Done when: Test via `curl` or Postman.

- [x] [TASK-103] Add Authentication Middleware
  - Description: Secure sensitive routes using a JWT verification middleware.
  - Done when: Backend rejects requests without a valid `Bearer` token.

## [PHASE-2] Frontend Auth Integration

- [x] [TASK-201] Implement `AuthContext`
  - Description: Create a context to manage the JWT and user state across the app.
  - Done when: `useAuth` hook is usable in any component.

- [ ] [TASK-202] Build Login/Signup UI
  - Description: Add authentication screens to the `app/` directory.
  - Done when: User can successfully log in and see their account state.

## [PHASE-3] Data Synchronization

- [ ] [TASK-301] Update Models for Syncing
  - Description: Add `userId`, `updatedAt`, and `isDeleted` to topics on both Frontend and Backend.
  - Done when: DB schema reflects changes and types match.

- [ ] [TASK-302] Implement Sync Endpoints (Pull/Push)
  - Description: Backend logic for bulk fetching and upserting data based on timestamps.
  - Done when: API returns correctly filtered results for a specific user.

- [ ] [TASK-303] Implement Sync Service (Frontend)
  - Description: Logic to reconcile local data with remote DB on app start and data change.
  - Done when: Topic created on Device A appears on Device B after sync.

## [PHASE-4] Cloud Audio Storage

- [ ] [TASK-401] Configure GCS Integration
  - Description: Set up the Google Cloud Storage client in the backend.
  - Done when: Files can be uploaded and retrieved programmatically.

- [ ] [TASK-402] Update Audio persistence for Cloud
  - Description: Update `AudioPersistence` to check for local cache -> then remote GCS.
  - Done when: Audio generated on one device plays on another without re-generation.
