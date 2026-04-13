# Architecture

## System Overview

The system is organized as a monorepo-style project with separate `frontend` and `backend` directories. This structure ensures clear separation of concerns between the mobile client and the secure API proxy.

## Components

1. **Mobile App (frontend/):** React Native / Expo.
    - Manages local topic storage.
    - Provides UI for creating and viewing notes.
    - Communicates with the backend for AI script and audio generation.
2. **Backend API (backend/):** Node.js / Express.
    - Acts as a secure proxy for Gemini AI and Google Cloud TTS.
    - Handles prompt engineering and script transformation logic.
3. **Google Cloud TTS:** External service for high-quality audio generation.
4. **Gemini AI:** External service for transforming notes into educational scripts.

## Data Flow

1. User enters notes -> Mobile App.
2. Mobile App -> Backend: Request script generation.
3. Backend -> AI Service: Generate script.
4. Backend -> Mobile App: Return script.
5. Mobile App -> Backend: Request audio generation.
6. Backend -> Google TTS: Generate .mp3.
7. Backend -> Mobile App: Return .mp3 URL or binary.
8. Mobile App: Play audio.
