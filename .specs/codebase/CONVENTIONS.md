# Conventions

## Frontend
- **Styling:** Component styles MUST be defined in separate `.styles.ts` files (e.g., `index.styles.ts`) and imported into the component. Shared styles should be placed in `src/styles/`.
- **Logic:** Prefer functional components and hooks in React Native.

## Backend
- **Endpoint Validation:** All API endpoints MUST use Zod for request schema validation (body, query, params) via the `validate` middleware.
- **Project Structure:**
  - `src/routes.ts`: Central routing definition.
  - `src/api/`: Endpoint handlers.
  - `src/schemas/`: Zod schemas for endpoints.
  - `src/middleware/`: Reusable middleware.

## Naming
- Files: kebab-case (e.g., `topic-list.tsx`).
- Variables/Functions: camelCase.
- Components/Classes: PascalCase.

## Workflow
- Atomic commits with descriptive messages.
- Verify changes with tests before completing tasks.
