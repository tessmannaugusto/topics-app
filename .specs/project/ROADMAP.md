# Roadmap

**Current Milestone:** Milestone 1: Core Audio Experience (MVP)
**Status:** Nearly Complete

---

## Milestone 1: Core Audio Experience (MVP)

**Goal:** A basic Android app that can turn text notes into a playable audiobook using AI and Google TTS.
**Status:** Nearly Complete

### Features

**Topic & Note Management** - DONE
- Create topics.
- Add/Edit text notes for each topic.

**AI Script Generator** - DONE
- Transform raw notes into "audiobook language" scripts.
- Include practical examples in the script.

**TTS Audio Generator** - DONE
- Integrate Google Cloud TTS to convert scripts to MP3.
- Save audio files locally on the device.
- Delete audio functionality.

**Audio Player** - DONE
- Basic playback controls (Play/Pause).
- Advanced seeking functionality (Slider, Time display).
- Global playback management (Persistent audio across navigation).
- Background playback support.

**File Imports** - DONE
- Support importing .txt and .md files to populate topic notes.

**Voice-to-Note** - DONE
- Capture audio input and transcribe to notes using Google STT.

---

## Milestone 2: Interactive Learning

**Goal:** Add AI-driven questions and answers to the learning loop.
**Status:** In Progress (Specified)

### Features

**AI Question Generator** - SPECIFIED
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

## Future Considerations

- Multi-platform support (iOS/Web).
- Offline mode for audio playback.
- Progress tracking and SRS (Spaced Repetition System) integration.

