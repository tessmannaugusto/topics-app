# Architecture

## System Overview

The application will follow a client-server architecture if a backend is required for secure API calls to Google Cloud and AI services.

## Components (Planned)

1. **Mobile App (React Native):** UI for topic management, audio playback, and user interactions.
2. **Backend API (Node.js/TS):** Handles TTS generation and AI script processing.
3. **Google Cloud TTS:** External service for audio generation.
4. **AI Service:** External service (Gemini/OpenAI) for content enhancement.

## Data Flow

1. User enters notes -> Mobile App.
2. Mobile App -> Backend: Request script generation.
3. Backend -> AI Service: Generate script.
4. Backend -> Mobile App: Return script.
5. Mobile App -> Backend: Request audio generation.
6. Backend -> Google TTS: Generate .mp3.
7. Backend -> Mobile App: Return .mp3 URL or binary.
8. Mobile App: Play audio.
