# Tasks: Web Frontend Support

## [PHASE-1] Foundation & Setup

- [x] [TASK-001] Install Web Dependencies
  - Description: Add `idb-keyval` and other necessary web-specific libraries to `frontend/package.json`.
  - Done when: `npm install idb-keyval` is successful and dev server starts.
  - Tests: `npx tsc --noEmit` in `frontend/`.

- [x] [TASK-002] Create Audio Storage Abstraction
  - Description: Implement `src/storage/audio-persistence.ts` with platform-specific versions (`.native.ts` and `.web.ts`).
  - Reuses: `expo-file-system` logic from `[id].tsx`.
  - Done when: Both versions share the same TypeScript interface.

- [x] [TASK-003] Update Topic Interface
  - Description: Update `Topic` in `topic-storage.ts` to accommodate web blob references.
  - Done when: Type errors are resolved across the project.

## [PHASE-2] UI Responsiveness

- [x] [TASK-004] Implement Responsive Wrapper
  - Description: Create `src/components/ResponsiveLayout.tsx` using `useWindowDimensions`.
  - Done when: Component correctly identifies mobile vs. desktop modes.

- [x] [TASK-005] Refactor `app/index.tsx` for Two-Pane View
  - Description: Extract list logic so it can be rendered as a sidebar component on desktop.
  - Done when: Index page looks identical on mobile but can be embedded on desktop.

- [x] [TASK-006] Refactor `app/[id].tsx` for Two-Pane View
  - Description: Extract detail logic for desktop embedding.
  - Done when: Detail page works both as a separate route and an embedded component.

## [PHASE-3] Web Feature Implementation

- [x] [TASK-007] Implement IndexedDB Persistence
  - Description: Complete `audio-persistence.web.ts` using `idb-keyval`.
  - Done when: Generated audio survives a browser refresh.

- [x] [TASK-008] Finalize Web Speech Integration
  - Description: Ensure `voice-recorder.ts` works seamlessly on supported web browsers.
  - Done when: User can transcribe audio in Chrome.

- [x] [TASK-009] Add "Download MP3" for Web
  - Description: Add a download button in the audio player for web users.
  - Done when: User can save the generated MP3 to their local disk.

## [PHASE-4] Validation & Deployment

- [x] [TASK-010] Full Feature Verification (Web)
  - Description: Manually test all v1 features in a web browser.
  - Done when: Checklist is completed (Topic, Script, Audio, Playback, Import).

- [x] [TASK-011] Production Build Test
  - Description: Run `npx expo export --platform web`.
  - Done when: `dist/` folder is generated without errors.
