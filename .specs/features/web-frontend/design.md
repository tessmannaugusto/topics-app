# Design: Web Frontend Support

## Architecture Overview

The web version will leverage **React Native Web** via Expo. The main architectural challenge is handling **File Storage** and **Responsive Layouts** in a way that doesn't break the existing Android application.

## Component Strategy

### 1. Responsive Shell (`src/components/ResponsiveLayout.tsx`)
A wrapper component that uses `useWindowDimensions` from `react-native`.

- **Mobile View:** Renders the screen normally. Navigation is handled by `expo-router` stacks.
- **Desktop View (width > 768px):** 
  - Left Sidebar: Renders the `app/index.tsx` (Topic List).
  - Right Content: Renders the active route's content (e.g., `app/[id].tsx`).
  - This requires refactoring `app/index.tsx` and `app/[id].tsx` to be "component-ready" (extracting logic from view).

### 2. Platform-Specific Storage (`src/storage/audio-persistence.ts`)
We will use the **Strategy Pattern** for audio file persistence.

- **`audio-persistence.ts`:** Main entry point (auto-dispatches based on `Platform.OS`).
- **`audio-persistence.native.ts`:** Uses `expo-file-system`.
- **`audio-persistence.web.ts`:** Uses `idb-keyval` (IndexedDB).

## Data Flow (Web Audio)

1. **Generation:** Frontend calls `backend/api/generate-audio`.
2. **Retrieval:** Frontend receives MP3 `Blob`.
3. **Storage:** Frontend saves `Blob` to IndexedDB using `idb-keyval` with the `topicId` as the key.
4. **Playback:** `AudioContext` retrieves the `Blob` from IndexedDB, creates a `URL.createObjectURL(blob)`, and passes it to `expo-av`.

## UI/UX Enhancements

- **Hover Effects:** Add hover states for buttons using `react-native`'s `Pressable` `hovered` state (available on web).
- **Custom Scrollbars:** Ensure scrollbars look consistent across browsers using CSS in `index.web.tsx` or a global style.
- **Download Action:** Add a "Download MP3" button visible ONLY on web to allow users to save their audiobooks locally.

## Build & Deployment

- **Command:** `npx expo export --platform web`
- **Output:** `dist/` folder (standard static assets).
- **Target:** Vercel (recommended for its easy integration with monorepos and static Expo exports).
