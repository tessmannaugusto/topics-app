# Feature: Local Storage Consolidation (DB Removal)

## Objective
Remove all backend database usage and transition the application to a fully decentralized, frontend-driven local storage model.

## Requirements
- **REQ-1: Backend DB Removal**
  - Delete all Prisma schema files, migrations, and configuration.
  - Remove the SQLite database file (`dev.db`).
  - Delete the backend Prisma client utility (`src/lib/prisma.ts`).
- **REQ-2: Dependency Cleanup**
  - Uninstall `@prisma/client`, `prisma`, and related database drivers from the backend.
- **REQ-3: Model Parity**
  - Ensure the frontend `Topic` and `Folder` interfaces in `topic-storage.ts` include all fields previously defined in the Prisma schema (e.g., `updatedAt`, `evaluation`).
- **REQ-4: Verification**
  - The backend must start without any database-related errors.
  - The frontend must continue to persist all data (notes, scripts, audio, questions) across sessions using local storage.

## Success Criteria
- No database-related files exist in the `backend/` directory.
- Backend `package.json` no longer lists Prisma or DB dependencies.
- Full CRUD functionality for topics and folders works correctly on both Web and Mobile using only local storage.
