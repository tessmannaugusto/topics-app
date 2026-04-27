# Topics

**Vision:** An app to enhance learning by transforming notes into interactive, AI-generated audiobooks with smart questioning and evaluation.
**For:** Students and lifelong learners who want an efficient way to study any topic.
**Solves:** The difficulty of engaging deeply with study material and retaining information through passive reading alone.

## Goals

- Create a seamless "Text-to-Learning-Audio" pipeline using AI and TTS.
- Enable active recall through AI-generated questions and evaluations.
- Provide a lightweight, simple mobile experience for learning on the go.

## Tech Stack

**Core:**

- Framework: React Native (Expo/Bare) for Android
- Language: TypeScript
- Backend: Node.js with TypeScript (if needed)

**Key dependencies:**

- Google Cloud Text-to-Speech API
- AI Model (e.g., OpenAI/Gemini) for script and question generation
- Audio playback library for React Native

## Scope

**v1 includes:**

- **Topic Management:** Adding/Editing notes for a specific topic, including inline editing.
- **Script Generation:** AI-driven transformation of notes into audiobook-style scripts with examples.
- **Audio Generation:** Using Google TTS to convert scripts into MP3.
- **Audio Player:** Advanced audio playback including seeking, global state management, and background support.
- **File Imports:** Support for importing .txt and .md files into topic notes.
- **Voice-to-Note:** Capture audio input and transcribe it to notes.
- **Web Support:** Full responsive web frontend with browser-compatible storage.
- **Topic Organization (Folders):** Group related topics into folders for better management.
- **User Configurations:** Allow users to provide their own Gemini API keys (v1).

**Explicitly out of scope for v1:**

- Importing .txt or .md files.
- Generating questions about a topic.
- Sending/Correcting answers to questions.
- User authentication/Cloud sync.

## Constraints

- Platform: Android (Initial target).
- Design: Lightweight and extremely simple.
- Resources: Google TTS and AI API costs.
