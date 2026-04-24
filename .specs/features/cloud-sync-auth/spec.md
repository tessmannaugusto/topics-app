# Feature Spec: Cloud Sync & Auth

Enable users to create accounts and sync their topics, notes, and progress across mobile and web devices.

## Requirements

### [REQ-SYNC-001] User Authentication
- Users MUST be able to sign up, log in, and log out.
- Auth status MUST persist across app restarts using `expo-secure-store` (Mobile) and `AsyncStorage` (Web).
- SUPPORTED METHODS: Email/Password (v1).

### [REQ-SYNC-002] Remote Data Persistence
- Topics, Notes, and AI Scripts MUST be stored in a central PostgreSQL database.
- Audio files (.mp3) MUST be stored in a Google Cloud Storage (GCS) bucket.

### [REQ-SYNC-003] Offline-First Sync Logic
- The app SHOULD prioritize local storage (`AsyncStorage` / `idb-keyval`) for immediate UI updates.
- Data SHOULD sync to the cloud in the background when an internet connection is available.
- CONFLICT RESOLUTION: Last-Write-Wins (LWW) based on `updatedAt` timestamps.

### [REQ-SYNC-004] Data Migration (Anonymous to Authenticated)
- When a user logs in for the first time, existing local data SHOULD be merged into their new cloud account.

### [REQ-SYNC-005] Cross-Platform Consistency
- Changes made on the Web version MUST reflect on the Mobile version (and vice versa) after a sync cycle.

## Constraints

- Framework: React Native (Expo) + Web (Unified).
- Backend: Express (Node.js) with Prisma ORM.
- Database: PostgreSQL (Neon DB).
- Storage: Google Cloud Storage (GCS).

## Success Criteria

- User logs in on Mobile, creates a topic.
- User logs in on Web, sees the same topic.
- Topic notes edited on Web sync to Mobile.
- Generated audio is accessible on both platforms without re-generation.
