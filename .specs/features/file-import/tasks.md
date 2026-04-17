# Tasks: File Import for Notes

## Tasks

### Setup
- [x] T1: Install `expo-document-picker` <!-- id: T1 -->
  - `npx expo install expo-document-picker`
  - **Done when**: `package.json` contains `expo-document-picker`.

### Implementation
- [x] T2: Create `handleFileImport` utility/logic <!-- id: T2 -->
  - Implement a function that wraps `DocumentPicker.getDocumentAsync` and `FileSystem.readAsStringAsync`.
  - **Done when**: A reusable function exists to pick and read .txt/.md files.

- [x] T3: Integrate File Import in `CreateTopic` screen <!-- id: T3 -->
  - Add a "Import File" button near the Notes label.
  - Link it to the import logic to update the `notes` state.
  - **Done when**: User can pick a file in Create screen and see notes populated.

- [x] T4: Integrate File Import in `EditTopic` screen <!-- id: T4 -->
  - Add a "Import File" button near the Notes label.
  - Link it to the import logic to replace the `notes` state.
  - **Done when**: User can pick a file in Edit screen and see notes replaced.

### Verification
- [ ] V1: Verify .txt import <!-- id: V1 -->
- [ ] V2: Verify .md import <!-- id: V2 -->
- [ ] V3: Verify substitution behavior <!-- id: V3 -->
