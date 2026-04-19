# Voice-to-Note Specification

## Problem Statement
Users may find it easier to dictate their notes rather than typing or importing files, especially when on the go.

## Goals
- Allow users to record audio directly in the app.
- Use Web Speech API (where available, primarily on web) for real-time transcription.
- Use Google Cloud Speech-to-Text as a fallback or for native platforms.
- Append the transcribed text to the Notes field.

## User Stories

### VOICE-01: Dictate notes during creation/editing
**User Story**: As a student, I want to record my voice so that my notes are automatically transcribed and added to the topic.

**Acceptance Criteria**:
- A "Mic" button is available near the Notes field.
- Pressing the button starts recording/transcription.
- Visual feedback is shown while recording (e.g., button color change or timer).
- If on web and supported, use Web Speech API for real-time transcription (appending to notes as the user speaks or after stopping).
- If on native or web fallback, stopping the recording sends the audio to the backend for transcription.
- The transcribed text is appended to the Notes field.
- Users can cancel recording without transcribing.

## Technical Details
- **Audio Recording**: `expo-av` will be used for capturing audio (fallback/native).
- **Web Speech API**:
  - Use `window.SpeechRecognition` or `window.webkitSpeechRecognition`.
  - Handle `onresult` to get the transcript.
  - Continuous mode should be enabled for longer dictations.
- **Platform-Specific Formats**:
  - **Android**: AMR_WB (16kHz).
  - **iOS**: LINEARPCM (WAV, 16kHz).
- **Backend Proxy**:
  - A new endpoint `POST /api/transcribe` in the backend.
  - Uses Google Cloud Speech-to-Text REST API (v1).
  - Receives base64-encoded audio and returns the transcript.
- **MIME Types**: 
  - `audio/amr` for Android.
  - `audio/wav` for iOS.

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| --- | --- | --- | --- |
| VOICE-01 | Capture audio from mic | Execute | Verified |
| VOICE-02 | Transcribe audio via Google STT | Execute | Verified |
| VOICE-03 | Update Notes field with transcript | Execute | Verified |
| VOICE-04 | Handle Android/iOS formats | Execute | Verified |
| VOICE-05 | Implement Web Speech API transcription | Execute | Verified |

**Status values**: Pending → In Design → In Tasks → Implementing → Verified
