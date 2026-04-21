# Tasks: Inline Notes Editing

## [PHASE-1] Component Refactoring

- [x] [TASK-601] Update `TopicNotes` state and props
  - Description: Add `isEditing`, `localNotes` state and pass `topic`, `onUpdateTopic` props.
  - Done when: Component can toggle between text and input modes.

- [x] [TASK-602] Implement Inline TextInput UI
  - Description: Style the `TextInput` to be comfortable for long notes.
  - Done when: User can type and see their changes in the draft state.

## [PHASE-2] Feature Integration

- [x] [TASK-603] Integrate File Import
  - Description: Move the `pickAndReadNoteFile` logic into the `TopicNotes` component.
  - Done when: User can import a file directly into the editor.

- [x] [TASK-604] Integrate Voice-to-Note
  - Description: Port transcription logic from `edit/[id].tsx` to `TopicNotes`.
  - Done when: User can use the "Mic" button to transcribe notes.

- [x] [TASK-605] Implement Persistence Logic
  - Description: Call `saveTopic` and `onUpdateTopic` when clicking "Update Notes".
  - Done when: Changes survive a page refresh.

## [PHASE-3] Cleanup & Verification

- [x] [TASK-606] Remove Legacy Edit Page
  - Description: Remove "EDIT" button from `TopicDetail` and delete `app/edit/[id].tsx`.
  - Done when: No more navigation links to the old edit screen exist.

- [x] [TASK-607] Validation & Build
  - Description: Run type checks and build the frontend.
  - Done when: `npx tsc --noEmit` passes.
