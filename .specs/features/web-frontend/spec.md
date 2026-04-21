# Feature Spec: Web Frontend (Unified Expo)

Enable the "Topics" app to run in any modern web browser using the existing codebase.

## Requirements

### [REQ-WEB-001] Unified Codebase
- The existing `frontend/` project MUST serve both Android and Web platforms.
- Avoid platform-specific code unless necessary (use `.web.tsx` or `Platform.select`).

### [REQ-WEB-002] Responsive Desktop Layout
- The UI MUST adapt to desktop screens. 
- Implement a two-pane layout for desktop (e.g., Topic list on left, Detail on right).
- Use `useWindowDimensions` or `react-native-web` Media Queries to handle transitions.

### [REQ-WEB-003] Audio Persistence (Web)
- Audio blobs generated on web MUST be persisted in the browser to avoid data loss on refresh.
- IMPLEMENTATION: Use `idb-keyval` or native IndexedDB to store MP3 blobs and associate them with Topic IDs.

### [REQ-WEB-004] Voice-to-Note (Web)
- Use Web Speech API for transcription on supported browsers (Chrome, Edge).
- Fallback gracefully when the API is not available.

### [REQ-WEB-005] Deployment Ready
- Configure the project for production web builds (`npx expo export --platform web`).
- Define the build and deployment process (e.g., Vercel or GitHub Pages).

## Constraints

- Framework: React Native (Expo Web / Metro).
- Routing: Expo Router (already in place).
- Storage: `AsyncStorage` for JSON data, IndexedDB for audio blobs.

## Success Criteria

- App runs locally via `npx expo start --web`.
- User can create topics, generate scripts, and listen to audio in a desktop browser.
- Audio survives a page refresh.
- UI looks professional on both mobile and desktop screen sizes.
