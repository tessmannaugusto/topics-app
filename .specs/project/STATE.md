# State: Topics

## Decisions

| Date | Decision | Context |
|------|----------|---------|
| 2026-04-11 | Android via React Native | User preference for Android app and React Native/TS stack. |
| 2026-04-11 | Node.js/TS Backend | Decided to use Node.js if a backend is needed for API proxying or storage. |
| 2026-04-11 | Google TTS for Audio | User specifically requested Google TTS for .mp3 generation. |
| 2026-04-13 | Mono-repo for Backend | Setup backend in `/backend` folder. |
| 2026-04-13 | Google Gemini for Scripting | User preference for Gemini over OpenAI. |
| 2026-04-15 | Global Audio Context | Implemented `AudioContext` to manage single-source playback across navigation. |
| 2026-04-15 | 0.0.0.0 Backend Host | Set backend to listen on all interfaces to fix connection refused errors. |
| 2026-04-15 | Web Blob URLs | Use `URL.createObjectURL` for temporary audio playback on Web since `FileSystem` is native-only. |
| 2026-04-17 | File Import for Notes | Use `expo-document-picker` to import .txt and .md files into topic notes. |

## Blockers

- [ ] Need Google Cloud credentials/API key for TTS (Integration pending - currently testing with Gemini API key).

## Lessons Learned

- Expo `Constants.expoConfig?.hostUri` is useful for identifying the local machine's IP for backend communication during dev.
- `expo-file-system` is not available on Web; use Blobs and `URL.createObjectURL` for browser testing.
- For background audio on mobile, `Audio.setAudioModeAsync` must be configured with `staysActiveInBackground: true`.
- Native `Alert.alert` does not work on Web; use a helper that falls back to `window.confirm`/`alert`.
- `expo-document-picker` works on Web by returning a local blob URI that can be fetched to read text content.

## Todos

- [x] Initialize React Native project.
- [x] Define backend architecture (Express in /backend).
- [x] Implement AI Script Generation (Logic + UI).
- [x] Implement Advanced Script Regeneration with User Instructions.
- [x] Add "Back to Topics" navigation to Topic Detail.
- [x] Setup TTS Backend Proxy endpoint.
- [x] Implement initial Audio Player in Topic Detail.
- [x] Research Google TTS React Native integration options. (Done: Decided on Backend Proxy).
- [x] Implement advanced Audio Player with seeking and global state.
- [x] Implement "Delete Audio" functionality.
- [x] Implement File Import (.txt/.md) for topic notes.
- [x] Implement Voice-to-Note (STT) for topic notes.
- [x] Implement Web Frontend Support (Responsive + Persistence).
- [x] Implement Topic Detail Tabs refactor.
- [x] Implement Inline Notes Editing (Replace Edit Page).
- [ ] Implement Cloud Sync & Auth (v1).
- [ ] Implement Note Reorganization (AI cleanup/restructuring).

## Deferred Ideas

- AI Question/Answer loop - Deferred to Milestone 2.
c notes.
- [ ] Implement Note Reorganization (AI cleanup/restructuring).

## Deferred Ideas

- AI Question/Answer loop - Deferred to Milestone 2.
