# Testing

## Current State

- No tests implemented yet.
- `package.json` has a placeholder test script.

## Planned Strategy

- **Build Integrity:** ALL changed files must pass a type check (`tsc --noEmit`) to ensure zero build errors before any task is considered complete.
- **Unit Tests:** Jest for business logic and components.
- **Integration Tests:** Verifying API calls and data flow.
- **E2E Tests:** Testing critical paths on Android (e.g., Detox).
