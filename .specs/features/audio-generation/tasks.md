# Tasks: TTS Audio Generation

## Status

- Total: 6
- Complete: 6
- Remaining: 0
- Blocked: 0

## Task List

### Backend Integration
- [x] [AUDIO-T01] Install `@google-cloud/text-to-speech` and setup the backend proxy endpoint. (Depends on: -) [Done when: `/api/generate-audio` exists and is ready for integration.] [Tests: -] [Gate: -]
- [x] [AUDIO-T02] Implement the synthesis logic in `generate-audio.ts` using Google Cloud SDK. (Depends on: AUDIO-T01) [Done when: Endpoint receives text and returns a binary MP3 buffer.] [Tests: Manual curl test saving to file.] [Gate: -]

### Mobile App Integration
- [x] [AUDIO-T03] Install `expo-file-system` and `expo-av` in the frontend. (Depends on: -) [Done when: Dependencies are added to `package.json` and linked.] [Tests: -] [Gate: -]
- [x] [AUDIO-T04] Implement the frontend logic to call the audio endpoint and save the file to local storage. (Depends on: AUDIO-T02, AUDIO-T03) [Done when: Clicking "Generate Audio" saves a file and updates topic metadata.] [Tests: -] [Gate: -]
- [x] [AUDIO-T05] Update `TopicDetail` UI with "Generate Audio" button and an advanced audio player with seeking and global state. (Depends on: AUDIO-T04) [Done when: User can play/pause, seek, and delete generated audio; playback persists across screens.] [Tests: -] [Gate: -]
- [x] [AUDIO-T07] Install `expo-speech` and integrate local TTS into `AudioContext.tsx`. (Depends on: -) [Done when: `AudioContext` provides a `speakLocal` function.] [Tests: -] [Gate: -]
- [x] [AUDIO-T08] Update `TopicDetail` to offer "Local TTS" as an option when Cloud Audio is not available. (Depends on: AUDIO-T07) [Done when: User can trigger local speech for a script.] [Tests: -] [Gate: -]

### Validation
- [x] [AUDIO-T06] Perform end-to-end test of audio generation and playback. (Depends on: AUDIO-T05) [Done when: Full flow from notes to playback works in the app.] [Tests: Manual UAT.] [Gate: -]
- [x] [AUDIO-T09] Verify local TTS works across Android/iOS/Web platforms. (Depends on: AUDIO-T08) [Done when: Local speech works on all platforms.] [Tests: Manual UAT.] [Gate: -]
