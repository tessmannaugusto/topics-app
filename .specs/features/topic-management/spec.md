# Topic & Note Management Specification

## Problem Statement

Users need a simple way to create and manage their study topics and notes within the app. This information serves as the raw material for AI-generated scripts and audiobook audio.

## Goals

- [ ] Users can easily create, view, edit, and delete study topics.
- [ ] Each topic can store notes, AI-generated scripts, and audio file references.
- [ ] Data is persisted locally on the device for a seamless experience.

## Out of Scope

| Feature | Reason |
| --- | --- |
| Importing files (.txt, .md) | Deferred to Milestone 3. |
| Rich text editing (Bold, Italic, etc.) | Simple text is sufficient for AI script generation in v1. |
| Cloud synchronization | Local storage is the focus for the MVP. |

---

## User Stories

### P1: Manage Topics ⭐ MVP

**User Story**: As a student, I want to create a topic with a name and notes so that I can organize my learning material.

**Why P1**: This is the fundamental building block for the entire app. Without topics and notes, no audio can be generated.

**Acceptance Criteria**:

1. WHEN the user opens the app THEN they SHALL see a list of their existing topics (or an empty state).
2. WHEN the user clicks "Create Topic" THEN they SHALL be able to enter a **Topic Name** and **Notes**.
3. WHEN the user saves a topic THEN the system SHALL record the **Date Created**.
4. WHEN the user views a topic THEN the system SHALL display its **Name**, **Notes**, **Date Created**, **AI Script** (if any), and **Audio File** reference (if any).
5. WHEN the user edits a topic THEN they SHALL be able to update the **Name** and **Notes**.
6. WHEN the user deletes a topic THEN the system SHALL remove it from the list and local storage.

**Independent Test**: Can create a topic named "Photosynthesis" with some notes, see it in the list, edit its name, and then delete it.

---

## Edge Cases

- WHEN the user tries to save a topic with an empty Name THEN the system SHALL show a validation error.
- WHEN the user deletes a topic that has an associated .mp3 file THEN the system SHALL (ideally) also delete the local file to save space (to be refined in implementation).
- WHEN the user has no topics THEN the system SHALL display a friendly "No topics yet" message.

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| --- | --- | --- | --- |
| TOPIC-01 | P1: Manage Topics (List) | Execute | Verified |
| TOPIC-02 | P1: Manage Topics (Create) | Execute | Verified |
| TOPIC-03 | P1: Manage Topics (Read/View) | Execute | Verified |
| TOPIC-04 | P1: Manage Topics (Update/Edit) | Execute | Verified |
| TOPIC-05 | P1: Manage Topics (Delete) | Execute | Verified |
| TOPIC-06 | P1: Manage Topics (Persistence) | Execute | Verified |

**Status values**: Pending → In Design → In Tasks → Implementing → Verified

**Coverage**: 6 total, 6 mapped to tasks, 6 verified

---

## Success Criteria

- [ ] User can create a new topic in less than 30 seconds.
- [ ] Topic data persists across app restarts.
- [ ] Zero data loss when editing existing topics.
