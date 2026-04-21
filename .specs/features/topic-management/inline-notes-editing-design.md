# Design: Inline Notes Editing

## Architecture Overview

The `TopicNotes.tsx` component will be transformed from a static display component into a stateful editor. It will manage its own internal editing state and handle external logic for file imports and voice transcription.

## Component Structure

### `TopicNotes.tsx`
- **Props:** 
  - `topic: Topic`
  - `onUpdateTopic: (updatedTopic: Topic) => void`
  - `customAlert: (title: string, message: string, onConfirm?: () => void) => void`
- **Internal State:**
  - `isEditing: boolean` (Toggles the UI between view and edit modes).
  - `localNotes: string` (Current draft of the notes).
  - `isRecording: boolean` (State for voice transcription).
  - `interimTranscript: string` (Real-time transcription display).

## UI States

### 1. View Mode (Default)
- Shows the notes as a `Text` element.
- Wrapped in a `TouchableOpacity` to trigger `isEditing = true`.
- Displays a visual hint that it's clickable.

### 2. Edit Mode
- Replaces the text with a `TextInput` (multiline).
- **Tool Bar:** Contains "Import .txt/.md" and "Mic" buttons.
- **Action Bar:** Contains "Update Notes" and "Cancel" buttons.

## Integration Points

- **File Import:** Uses `src/storage/file-import.ts`.
- **Voice-to-Note:** Uses `src/storage/voice-recorder.ts` and the backend `/transcribe` endpoint.
- **Persistence:** Uses `src/storage/topic-storage.ts` via the `onUpdateTopic` callback to notify the parent.

## Layout Changes

- The "EDIT" button in the `TopicDetail.tsx` header will be removed to consolidate all editing into the "Notes" tab.
