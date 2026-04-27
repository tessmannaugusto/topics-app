# Topic Organization (Folders) Specification

## Problem Statement

As users create more topics, the main list becomes cluttered and difficult to navigate. Users need a way to group related topics into folders to keep their workspace organized.

## Goals

- [ ] Users can create folders with descriptive names.
- [ ] Users can group multiple topics into a single folder.
- [ ] Users can view and manage topics within a specific folder.
- [ ] Users can move topics between folders or remove them from folders.

## Out of Scope

- [ ] Nested folders (folders within folders).
- [ ] Folder icons or custom colors (name only for v1).
- [ ] Bulk moving of topics (one by one for v1).

---

## User Stories

### P1: Manage Folders ⭐ MVP

**User Story**: As a user, I want to create folders on the main page so that I can categorize my topics by subject.

**Acceptance Criteria**:
1. WHEN the user is on the main page THEN they SHALL see an option to "Create Folder".
2. WHEN the user creates a folder THEN they SHALL provide a **Folder Name**.
3. WHEN the user saves a folder THEN the system SHALL persist it locally.
4. WHEN the user is on the main page THEN they SHALL see a list of folders.

---

### P2: Organize Topics into Folders ⭐ MVP

**User Story**: As a user, I want to assign my topics to folders so that I can group related content together.

**Acceptance Criteria**:
1. WHEN the user creates or edits a topic THEN they SHALL be able to select a folder from the available folders.
2. WHEN a topic is assigned to a folder THEN it SHALL be visible within that folder's detail page.
3. WHEN a topic is assigned to a folder THEN it SHALL NOT be visible in the "General" or "Uncategorized" list on the main page (if we choose to separate them).
   - *Decision*: The main page will show Folders AND "Uncategorized" topics.

---

### P3: Folder Detail Page ⭐ MVP

**User Story**: As a user, I want to open a folder to see all topics assigned to it and manage them.

**Acceptance Criteria**:
1. WHEN the user selects a folder on the main page THEN they SHALL be navigated to the **Folder Detail Page**.
2. WHEN the user is on the Folder Detail Page THEN they SHALL see all topics assigned to that folder.
3. WHEN the user is on the Folder Detail Page THEN they SHALL be able to create a new topic directly into that folder.
4. WHEN the user is on the Folder Detail Page THEN they SHALL be able to edit the folder name or delete the folder.
   - *Constraint*: Deleting a folder SHALL NOT delete the topics inside it; topics SHALL become "Uncategorized".

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| --- | --- | --- | --- |
| ORG-01 | P1: Manage Folders (Create) | Execute | Verified |
| ORG-02 | P1: Manage Folders (List) | Execute | Verified |
| ORG-03 | P2: Topic Assignment | Execute | Verified |
| ORG-04 | P3: Folder Detail (View Topics) | Execute | Verified |
| ORG-05 | P3: Folder Detail (Create Topic) | Execute | Verified |
| ORG-06 | P3: Folder Detail (Edit/Delete Folder) | Execute | Verified |
| ORG-07 | P3: Folder Deletion Topic Preservation | Execute | Verified |

**Status values**: Pending → In Design → In Tasks → Implementing → Verified

---

## Success Criteria

- [ ] Users can create a folder and add 5 topics to it in less than 1 minute.
- [ ] Folder structure and topic assignments persist across app restarts.
- [ ] Deleting a folder preserves its topics as uncategorized.
