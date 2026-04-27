# Topic Organization (Folders) Tasks

## Phase 1: Storage & Models
- [x] T1: Update `Topic` interface and add `Folder` interface in `topic-storage.ts`. [ORG-03]
- [x] T2: Implement `getFolders`, `saveFolder`, and `deleteFolder` in `topic-storage.ts`. [ORG-01]
- [x] T3: Update `deleteFolder` to unset `folderId` in all topics belonging to that folder. [ORG-07]

## Phase 2: Navigation & Routes
- [x] T4: Create `app/folder/[id].tsx` for folder detail view. [ORG-04]
- [x] T5: Update `app/_layout.tsx` if needed (Expo Router usually auto-detects). [ORG-02]

## Phase 3: UI Components
- [x] T6: Update `TopicList` component to support filtering by `folderId`. [ORG-04]
- [x] T7: Create `FolderList` component. [ORG-02]
- [x] T8: Update `TopicList` on main page to show only "Uncategorized" topics. [ORG-02]
- [x] T9: Add "Create Folder" button/dialog to main page. [ORG-01]

## Phase 4: Integration
- [x] T10: Update `create.tsx` to allow folder selection when creating a topic. [ORG-03]
- [x] T11: Update `TopicDetail` (or `[id].tsx`) to allow moving a topic to a folder. [ORG-03]
- [x] T12: Add "Create Topic" button in `FolderDetail` that pre-selects the folder. [ORG-05]
- [x] T13: Add Edit/Delete folder functionality in `FolderDetail`. [ORG-06]

## Phase 5: Verification
- [x] V1: Verify folder creation and listing.
- [x] V2: Verify topic assignment to folder.
- [x] V3: Verify folder deletion preserves topics.
- [x] x4: Verify navigation between main page and folder detail.
