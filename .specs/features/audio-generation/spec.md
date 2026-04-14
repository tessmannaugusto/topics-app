# TTS Audio Generation Specification

## Problem Statement

A text-based script is a good start, but the primary goal of this app is to provide an eyes-free learning experience. We need to convert the AI-generated scripts into high-quality audio files that the user can listen to on their device.

## Goals

- [ ] Convert AI-generated scripts into MP3 audio files using Google Cloud Text-to-Speech.
- [ ] Support high-quality, natural-sounding voices (e.g., WaveNet or Journey).
- [ ] Store the generated audio files and associate them with the corresponding topics.
- [ ] Allow the user to trigger audio generation from the topic detail view.

## Out of Scope

- [ ] Support for multiple languages (v1: English only).
- [ ] Voice selection UI (v1: hardcoded high-quality voice).
- [ ] Speech-to-text for user responses (v2).

---

## User Stories

### P1: Convert Script to Audio ⭐ MVP

**User Story**: As a student, I want to listen to the generated script as an audiobook, so that I can study while commuting or doing other tasks.

**Why P1**: This is the core functionality that defines the "Audiobook" aspect of the app.

**Acceptance Criteria**:

1. WHEN the user requests audio generation for a script THEN the system SHALL send the script to Google Cloud TTS.
2. THE system SHALL receive an MP3 audio file (or binary stream) from Google Cloud TTS.
3. THE system SHALL store the audio file (locally or on a server, TBD in Design).
4. THE system SHALL update the topic's `audioFileUri` field with the path/URL to the audio file.
5. THE user SHALL see a play button (or audio status) once the audio is generated.

---

## Edge Cases

- WHEN the script is empty THEN the "Generate Audio" button SHALL be disabled.
- WHEN Google Cloud TTS API fails THEN the system SHALL show an error message and allow retry.
- WHEN the user updates the script THEN the system SHALL invalidate the existing audio and prompt for regeneration.

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| --- | --- | --- | --- |
| AUDIO-01 | P1: Backend integration with Google Cloud TTS | Specify | Pending |
| AUDIO-02 | P1: Audio generation trigger in UI | Specify | Pending |
| AUDIO-03 | P1: Storage of audio files | Specify | Pending |
| AUDIO-04 | P1: Playback status/indicator | Specify | Pending |

**Status values**: Pending → In Design → In Tasks → Implementing → Verified

**Coverage**: 4 total, 0 mapped to tasks, 4 unmapped

---

## Success Criteria

- [ ] Audio generation takes less than 20 seconds for a standard script.
- [ ] The generated audio is clear and professional-sounding.
- [ ] Audio files are correctly associated with their topics and persist across app restarts.
