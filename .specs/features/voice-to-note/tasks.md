# Tasks: Voice-to-Note Implementation

## Tasks

### Setup
- [x] T1: Verify `expo-av` and `backend` dependencies <!-- id: T1 -->
  - `expo-av` is already installed in frontend.
  - No new backend dependencies needed for REST proxy.
  - **Done when**: Dependencies are confirmed.

### Backend
- [x] T2: Create `POST /api/transcribe` endpoint <!-- id: T2 -->
  - Create `backend/src/api/transcribe.ts`.
  - Handle base64 audio and platform-specific `RecognitionConfig`.
  - **Done when**: Endpoint returns transcript for sample base64 audio.

- [x] T3: Register route in `backend/src/routes.ts` <!-- id: T3 -->
  - **Done when**: `POST /api/transcribe` is accessible.

### Frontend
- [x] T4: Create Voice Recorder utility <!-- id: T4 -->
  - Create `frontend/src/storage/voice-recorder.ts`.
  - Implement start/stop/extract logic with `expo-av`.
  - **Done when**: Utility can capture audio and return base64.

- [x] T5: Integrate Mic UI in `CreateTopic` <!-- id: T5 -->
  - Add Mic button and recording state.
  - Link to transcription logic.
  - **Done when**: User can dictate notes in Create screen.

- [x] T6: Integrate Mic UI in `EditTopic` <!-- id: T6 -->
  - Add Mic button and recording state.
  - Link to transcription logic.
  - **Done when**: User can dictate notes in Edit screen.

### Verification
- [ ] V1: Verify Android transcription (AMR_WB) <!-- id: V1 -->
- [ ] V2: Verify iOS transcription (LINEAR16) <!-- id: V2 -->
- [ ] V3: Verify text appending behavior <!-- id: V3 -->
