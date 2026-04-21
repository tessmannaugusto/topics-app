# Design: Cloud Sync & Auth

## Architecture Overview

The "Topics" app will transition to a **Client-Server-Database** architecture with an **Offline-First** synchronization model.

### 1. Backend Design (Node.js/Express + Prisma)

- **Database:** PostgreSQL.
- **ORM:** Prisma.
- **Models:**
  - `User`: `id`, `email`, `passwordHash`, `createdAt`.
  - `Topic`: `id`, `userId`, `name`, `notes`, `aiScript`, `audioFileUri`, `updatedAt`, `isDeleted`.
- **Auth Strategy:** 
  - `Signup/Login` using `bcrypt` for hashing.
  - `JWT` issued on login, stored in `HTTP-only` cookies (Web) or `SecureStore` (Mobile).
- **Sync Endpoints:**
  - `GET /sync/pull?since=timestamp`: Returns all topics updated since the given timestamp for the authenticated user.
  - `POST /sync/push`: Accepts a list of topics from the client and performs an `upsert` in the database.

### 2. Frontend Design (Expo/React Native + Web)

- **Auth State:** Managed via `AuthContext`.
- **Local Storage Wrapper:** Create `src/storage/sync-service.ts` to manage the interaction between local `AsyncStorage` and the remote API.
- **Sync Workflow:**
  1. App starts -> `Pull` changes from remote.
  2. Local edits -> Save to local DB + queue `Push` to remote.
  3. `Push` logic: Filter local topics with `updatedAt > lastSyncTimestamp`.
  4. Conflict handling: The server uses the `updatedAt` field to decide whether to update or ignore the incoming object.

### 3. Audio Storage Design (Google Cloud Storage)

- **Workflow:**
  1. Client generates audio (via Backend Proxy).
  2. Backend Proxy uploads the resulting MP3 to GCS bucket: `topics-audio/{userId}/{topicId}.mp3`.
  3. Backend returns the GCS signed URL or a public URL if the bucket is configured.
  4. Client stores the URL in `audioFileUri`.
- **Optimization:** Clients check for local file exists -> then remote URL.

## Security Considerations

- **JWT Secrets:** MUST be stored in `.env`.
- **Cloud Storage Permissions:** Use IAM roles to restrict backend access to GCS.
- **Database Access:** Use a connection string in `.env`.
