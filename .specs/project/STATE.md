# State: Topics

## Decisions

| Date | Decision | Context |
|------|----------|---------|
| 2026-04-11 | Android via React Native | User preference for Android app and React Native/TS stack. |
| 2026-04-11 | Node.js/TS Backend | Decided to use Node.js if a backend is needed for API proxying or storage. |
| 2026-04-11 | Google TTS for Audio | User specifically requested Google TTS for .mp3 generation. |

## Blockers

- [ ] Need Google Cloud credentials/API key for TTS.
- [ ] Need AI API key (OpenAI/Gemini/etc.) for script generation.

## Lessons Learned

- (None yet)

## Todos

- [x] Initialize React Native project.
- [ ] Define backend architecture (Serverless vs. Express).
- [ ] Research Google TTS React Native integration options.

## Deferred Ideas

- File imports (.txt/.md) - Deferred to Milestone 3.
- AI Question/Answer loop - Deferred to Milestone 2.
