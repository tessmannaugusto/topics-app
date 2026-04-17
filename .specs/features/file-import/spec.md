# File Import Specification

## Problem Statement
Users often have their study materials in external text or markdown files. Manually copying and pasting these into the app is tedious.

## Goals
- Allow users to import content from `.txt` and `.md` files directly into the topic notes.
- Support file selection from the device's file system.

## User Stories

### IMPORT-01: Import file during creation
**User Story**: As a student, I want to upload a file while creating a new topic so that the notes field is automatically populated.

**Acceptance Criteria**:
- A "Import File" button/link is available near the Notes field.
- Choosing a valid file (.txt or .md) reads the content and fills the Notes text input.
- If the file is not a supported type, an error message is shown (or it's filtered out in the picker).

### IMPORT-02: Import file during editing
**User Story**: As a student, I want to upload a file while editing a topic so that I can replace existing notes with new content.

**Acceptance Criteria**:
- A "Import File" button/link is available near the Notes field.
- Choosing a valid file replaces the current Notes content with the file's content.

## Technical Details
- **File Picker**: `expo-document-picker` will be used to select files.
- **File Reading**: `expo-file-system` (`readAsStringAsync`) will be used to read the content.
- **MIME Types**: 
  - `text/plain` (.txt)
  - `text/markdown` or generic text (.md)
- **Error Handling**: Basic alerts for unsupported files or read failures.

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| --- | --- | --- | --- |
| IMPORT-01 | Import during creation | Execute | Verified |
| IMPORT-02 | Import during editing | Execute | Verified |
| IMPORT-03 | Support .txt files | Execute | Verified |
| IMPORT-04 | Support .md files | Execute | Verified |

**Status values**: Pending → In Design → In Tasks → Implementing → Verified
