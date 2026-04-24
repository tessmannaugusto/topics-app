# Roadmap

**Current Milestone:** Milestone 2: Interactive Learning
**Status:** In Progress

---

## Milestone 1: Core Audio Experience (MVP)
**Status:** Complete

### Features

**Topic & Note Management** - DONE
- Create topics.
- Add/Edit text notes for each topic (inline editing).

**AI Script Generator** - DONE
- Transform raw notes into "audiobook language" scripts.
- Include practical examples in the script.

**TTS Audio Generator** - DONE
- Integrate Google Cloud TTS to convert scripts to MP3.
- Save audio files locally/web storage.
- Delete audio functionality.

**Audio Player** - DONE
- Playback controls (Play/Pause, Seeking).
- Global playback management.
- Background playback.

**File Imports** - DONE
- Support importing .txt and .md files to populate topic notes.

**Voice-to-Note** - DONE
- Capture audio input and transcribe to notes using Google STT.

**Unified Web Support** - DONE
- Full responsive web frontend.
- Web-specific persistence.

---

## Milestone 2: Interactive Learning

**Goal:** Add AI-driven questions and answers to the learning loop.
**Status:** In Progress (Specified)

### Features

**AI Question Generator** - DONE
- Generate relevant questions based on topic content.
- [Specification](../features/ai-question-generator/spec.md)

**Interactive Responses** - SPECIFIED
- Accept text or audio answers from the user.
- [Specification](../features/interactive-responses/spec.md)

**AI Evaluation & Feedback** - SPECIFIED
- Correct user answers and provide feedback on accuracy.
- [Specification](../features/ai-evaluation-feedback/spec.md)

---

## Milestone 3: Content Ingestion & Polishing

**Goal:** Streamline how topics are added and improve the overall experience.

### Features

**Note Reorganization** - PLANNED
- Use AI to clean up, de-duplicate, and structure raw notes.

**AI Topic Extraction** - PLANNED
- Automatically extract main points from messy or long notes.

---

## Milestone 4: Cloud Sync & Auth

**Goal:** Enable user accounts and cross-device data synchronization.
**Status:** Planned (Specified)

### Features

**Authentication (v1)** - SPECIFIED
- Email/Password Signup and Login.
- Secure token storage.
- [Specification](../features/cloud-sync-auth/spec.md)

**Offline-First Sync** - SPECIFIED
- Automatic background synchronization between local and remote DB.
- Conflict resolution (LWW).

**Cloud Audio Storage** - SPECIFIED
- Store generated MP3s in GCS.
- Access audio from any device without re-generation.

---

## Future Considerations

- Offline mode for audio playback.
- Progress tracking and SRS (Spaced Repetition System) integration.

