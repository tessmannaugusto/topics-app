# Concerns

## Risks

- **API Costs:** Google TTS and AI generation can become expensive with heavy use.
- **Latency:** TTS and AI generation may be slow, requiring good UI feedback (loading states).
- **Offline Access:** Users might expect to listen to audiobooks offline, requiring local storage management.

## Tech Debt

- Project is currently a bare `package.json` with no TypeScript or React Native boilerplate.
- `package.json` specifies `"type": "module"`, which needs to be consistent across the project.
