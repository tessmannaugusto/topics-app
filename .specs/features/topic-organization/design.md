# Topic Organization (Folders) Design

## Data Models

### Folder
```typescript
interface Folder {
  id: string;
  name: string;
  dateCreated: string;
}
```

### Updated Topic
```typescript
interface Topic {
  // ... existing fields
  folderId?: string; // Reference to Folder.id
}
```

## Storage Strategy

- **Folders**: Stored under `@folders` key in `AsyncStorage`.
- **Topics**: Existing `@topics` key, with added `folderId` property.

## Navigation Structure

- `index.tsx`: Main page showing Folders and Uncategorized topics.
- `folder/[id].tsx`: (New) Folder Detail page. Shows topics in that folder.
- `create.tsx`: Updated to allow selecting a folder.
- `[id].tsx`: Topic Detail page updated to allow changing folder.

## UI Components

### TopicList (Updated)
- Support filtering by `folderId`.
- Option to show/hide folders (maybe not needed if we use a separate list for folders on index).

### FolderList (New)
- Component to render the list of folders on the main page.

### FolderDetail (New)
- Screen to display topics within a folder and folder management options.

## Implementation Details

1. **Storage Layer**:
   - Add `getFolders`, `saveFolder`, `deleteFolder` to `topic-storage.ts`.
   - Update `Topic` interface in `topic-storage.ts`.
2. **Main Page**:
   - Update `TopicList` to only show topics without `folderId` by default (Uncategorized).
   - Add `FolderList` above or below the uncategorized topics.
3. **Folder Detail**:
   - Create `app/folder/[id].tsx`.
   - Use `TopicList` with a `folderId` prop to filter topics.
4. **Create/Edit Topic**:
   - Add a dropdown/picker to select a folder.
