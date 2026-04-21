# Design: Topic Detail Tabs

## Architecture Overview

The single `TopicDetail.tsx` component will be broken down into a main container that manages the header and tab state, while delegating the content of each tab to specialized sub-components.

## Component Structure

### 1. `TabBar.tsx`
A reusable component that handles the tab labels and the active state indicator.

- **Props:** `tabs: string[]`, `activeTab: number`, `onTabChange: (index: number) => void`.
- **Styling:** Uses `theme.colors.primary` for the active indicator and `theme.typography.label` for text.

### 2. `TopicNotes.tsx`
Display and editing of raw topic notes.

- **Props:** `notes: string`.
- **UI:** A simple scrollable view of the notes text.

### 3. `TopicAudiobook.tsx`
Handles everything related to the AI script and audio playback.

- **Props:** `topic: Topic`, `onUpdateTopic: (topic: Topic) => void`.
- **UI:** Script display, refinement input, and the audio player.

### 4. `TopicInteractive.tsx`
Placeholder for Milestone 2 features.

- **UI:** "Interactive mode coming soon! This is where you'll be able to answer AI-generated questions about your topic."

## State Management

- `TopicDetail.tsx` (Parent) will maintain:
  - `activeTab` (index: 0, 1, or 2).
  - `topic` (the loaded topic data).
- The `AudioContext` already manages the global playback state, so audio will seamlessly continue playing across tab switches.

## Layout

1. **Topic Header** (Name, Date).
2. **TabBar** (Sticky/Fixed below header).
3. **Tab Content** (Flex: 1, Scrollable).
