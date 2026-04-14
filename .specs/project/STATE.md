# State: Topics

## Decisions

| Date | Decision | Context |
|------|----------|---------|
| 2026-04-11 | Android via React Native | User preference for Android app and React Native/TS stack. |
| 2026-04-11 | Node.js/TS Backend | Decided to use Node.js if a backend is needed for API proxying or storage. |
| 2026-04-11 | Google TTS for Audio | User specifically requested Google TTS for .mp3 generation. |
| 2026-04-13 | Mono-repo for Backend | Setup backend in `/backend` folder. |
| 2026-04-13 | Google Gemini for Scripting | User preference for Gemini over OpenAI. |

## Blockers

- [ ] Need Google Cloud credentials/API key for TTS (Integration pending).

## Lessons Learned

- Expo `Constants.expoConfig?.hostUri` is useful for identifying the local machine's IP for backend communication during dev.

## Todos

- [x] Initialize React Native project.
- [x] Define backend architecture (Express in /backend).
- [x] Implement AI Script Generation (Logic + UI).
- [x] Implement Advanced Script Regeneration with User Instructions.
- [x] Add "Back to Topics" navigation to Topic Detail.
- [x] Setup TTS Backend Proxy endpoint (Pending credentials for logic).
- [x] Implement initial Audio Player in Topic Detail.
- [ ] Research Google TTS React Native integration options. (Done: Decided on Backend Proxy).
- [ ] Implement advanced Audio Player with seeking.

## Deferred Ideas

- File imports (.txt/.md) - Deferred to Milestone 3.
- AI Question/Answer loop - Deferred to Milestone 2.
