# Voice-to-Note Specification

## Problem Statement
Users may find it easier to dictate their notes rather than typing or importing files, especially when on the go.

## Goals
- Allow users to record audio directly in the app.
- Use Google Cloud Speech-to-Text to transcribe the audio into text.
- Append the transcribed text to the Notes field.

## User Stories

### VOICE-01: Dictate notes during creation/editing
**User Story**: As a student, I want to record my voice so that my notes are automatically transcribed and added to the topic.

**Acceptance Criteria**:
- A "Mic" button is available near the Notes field.
- Pressing the button starts recording audio.
- Visual feedback is shown while recording (e.g., button color change or timer).
- Stopping the recording sends the audio to the backend for transcription.
- The transcribed text is appended to the Notes field.
- Users can cancel recording without transcribing.

## Technical Details
- **Audio Recording**: `expo-av` will be used for capturing audio.
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

**Status values**: Pending → In Design → In Tasks → Implementing → Verified
