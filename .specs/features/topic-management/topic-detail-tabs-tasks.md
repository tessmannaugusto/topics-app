# Tasks: Topic Detail Tabs

## [PHASE-1] Foundation & Components

- [ ] [TASK-501] Create `TabBar.tsx` component
  - Description: Build a custom tab bar with active indicator.
  - Done when: Component renders correctly with multiple tab options.

- [ ] [TASK-502] Update `[id].styles.ts` for Tabs
  - Description: Add styles for the tab bar, active states, and tab content containers.
  - Done when: UI has correct spacing and responsive alignment.

- [ ] [TASK-503] Create Tab Skeleton Components
  - Description: Create `TopicNotes`, `TopicAudiobook`, and `TopicInteractive` boilerplate.
  - Done when: Files exist and can be imported into `TopicDetail`.

## [PHASE-2] Refactoring & State

- [ ] [TASK-504] Extract `TopicNotes` Logic
  - Description: Move notes-related UI and logic from `TopicDetail`.
  - Done when: Notes tab correctly displays the raw notes.

- [ ] [TASK-505] Extract `TopicAudiobook` Logic
  - Description: Move script/audio generation and player logic from `TopicDetail`.
  - Done when: Audiobook tab is functional and handles its own API calls.

- [ ] [TASK-506] Implement Tab Navigation in `TopicDetail`
  - Description: Add `activeTab` state and conditional rendering.
  - Done when: User can switch tabs without data loss or audio interruption.

## [PHASE-3] Polish & Validation

- [ ] [TASK-507] Final UI Polish
  - Description: Ensure correct padding and visual feedback for tab switches.
  - Done when: App feels responsive and professional.

- [ ] [TASK-508] Full Regression Test
  - Description: Verify all features (Edit, Delete, Script Gen, Audio Gen, STT, etc.) still work.
  - Done when: Manual tests pass on Mobile and Web.
