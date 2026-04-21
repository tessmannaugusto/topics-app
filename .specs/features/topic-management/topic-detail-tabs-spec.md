# Feature Spec: Topic Detail Tabs

Refactor the Topic Detail page to use a tabbed interface, separating the core learning materials (Notes), the generated experience (Audiobook), and future interactive features.

## Requirements

### [REQ-TABS-001] Tab Structure
- The Topic Detail page MUST feature a tab bar with three main sections:
  1. **Notes:** Raw study material and basic editing access.
  2. **Audiobook:** AI Script generation, refinement, and audio playback controls.
  3. **Interactive:** Future-proofed section for AI-generated questions and evaluation.

### [REQ-TABS-002] Visual Separation
- Each tab MUST only display relevant components.
- **Notes Tab:** Displays the `notes` field.
- **Audiobook Tab:** Displays the `aiScript`, refinement input, and the MP3 player/controls.
- **Interactive Tab:** Displays a placeholder for future Q&A features.

### [REQ-TABS-003] Header Consistency
- The Topic Name and Date created SHOULD remain visible at the top, regardless of the active tab.

### [REQ-TABS-004] Responsive Design
- The tab bar MUST work on both Mobile and Web/Desktop.
- On Web, the tab bar SHOULD be styled for high visibility.

### [REQ-TABS-005] Tab State
- The active tab SHOULD be stored in local component state.
- Transitioning between tabs MUST NOT reset the audio playback position or clear inputs (e.g., refinement instructions).

## Success Criteria

- User can switch between "Notes" and "Audiobook" tabs.
- Generating a script in the "Audiobook" tab does not affect the "Notes" tab view.
- The UI feels cleaner and more organized.
