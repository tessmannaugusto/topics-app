# Feature Spec: Inline Notes Editing

Enable users to edit topic notes directly within the "Notes" tab of the Topic Detail page, streamlining the experience by removing the need for a separate edit screen.

## Requirements

### [REQ-INLINE-001] Inline Editing
- The notes field in the "Notes" tab MUST be clickable and transition into an editable `TextInput`.
- The UI MUST clearly indicate that the field is editable (e.g., via background color change or border).

### [REQ-INLINE-002] File Import Integration
- The "Import .txt/.md" functionality MUST be moved from the edit page to the "Notes" tab.
- The button SHOULD be placed below the notes field but before the update button.

### [REQ-INLINE-003] Update Action
- An "Update Notes" button MUST be visible when the user is in editing mode.
- Clicking "Update Notes" MUST persist the changes to local storage and the central database (if Cloud Sync is active).

### [REQ-INLINE-004] Voice-to-Note Integration
- The "Mic" (transcription) feature SHOULD be available within the "Notes" tab for a unified editing experience.

### [REQ-INLINE-005] Deprecate Edit Page
- The separate `app/edit/[id].tsx` page MUST be removed or made redundant, and all navigation points to it SHOULD be removed.

## Success Criteria

- User clicks notes -> types changes -> clicks "Update Notes" -> changes persist.
- User imports a file within the Notes tab -> content appears in the input -> clicks "Update" -> changes persist.
- No navigation to a separate edit page is required for note updates.
