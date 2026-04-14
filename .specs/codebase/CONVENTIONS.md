# Conventions

## Coding Style

- Use TypeScript for all new files.
- Prefer functional components and hooks in React Native.

## Naming

- Files: kebab-case (e.g., `topic-list.tsx`).
- Variables/Functions: camelCase.
- Components/Classes: PascalCase.

## Backend
- **Endpoint Validation:** All API endpoints MUST use Zod for request schema validation (body, query, params) via the `validate` middleware.
- **Project Structure:**
  - `src/routes.ts`: Central routing definition.
  - `src/api/`: Endpoint handlers.
  - `src/schemas/`: Zod schemas for endpoints.
  - `src/middleware/`: Reusable middleware.

## Workflow

- Atomic commits with descriptive messages.
- Verify changes with tests before completing tasks.
