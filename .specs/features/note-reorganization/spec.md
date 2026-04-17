# Note Reorganization Specification

## Problem Statement

As users add notes via voice transcription, the content can become cluttered, repetitive, or poorly structured. Users need a way to automatically clean up and organize these notes to make them more readable and useful for script generation.

## Goals

- [ ] Users can trigger an AI-powered reorganization of their notes.
- [ ] The AI model should remove duplicate information.
- [ ] The AI model should restructure the text to be more coherent and logical.
- [ ] The process should be fast and cost-effective.
- [ ] The original notes are replaced by the reorganized version.

## Out of Scope

- [ ] Manually choosing reorganization styles (e.g., bullet points vs. paragraphs).
- [ ] Version history of notes (undoing the reorganization).
- [ ] Partial reorganization (reorganizing only a selection).

---

## User Stories

### P1: Reorganize Notes ⭐ MVP

**User Story**: As a student, I want to click a button to have my messy voice-transcribed notes cleaned up so that I can have a clear summary of what I've learned.

**Why P1**: Voice-to-note often results in "stream of consciousness" text. This feature is crucial for turning raw transcripts into useful study material.

**Acceptance Criteria**:

1. WHEN the user views a topic THEN they SHALL see an "Organize Notes" button near the notes section.
2. WHEN the user clicks "Organize Notes" THEN the system SHALL send the current notes to the backend.
3. WHEN the backend receives the notes THEN it SHALL use a fast/cheap AI model to reorganize the content.
4. WHEN the AI returns the reorganized text THEN the system SHALL update the topic's notes and save them.
5. WHEN the reorganization is in progress THEN the system SHALL show a loading indicator.
6. WHEN the reorganization is complete THEN the system SHALL display the updated notes.

**Independent Test**: Add several repetitive and disorganized sentences to a topic's notes, click "Organize Notes", and verify that the output is concise, structured, and free of duplicates.

---

## Edge Cases

- WHEN the notes are empty THEN the "Organize Notes" button SHALL be disabled.
- WHEN the AI model fails or is unavailable THEN the system SHALL show an error message and keep the original notes.
- WHEN the reorganized notes are much shorter (or empty, though unlikely) THEN the user should still be notified of the change.

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| --- | --- | --- | --- |
| REORG-01 | P1: Reorganize Notes (UI Trigger) | Design | Pending |
| REORG-02 | P1: Reorganize Notes (Backend API) | Design | Pending |
| REORG-03 | P1: Reorganize Notes (AI Integration) | Design | Pending |
| REORG-04 | P1: Reorganize Notes (Update & Save) | Design | Pending |
| REORG-05 | P1: Reorganize Notes (Error Handling) | Design | Pending |

**Status values**: Pending → In Design → In Tasks → Implementing → Verified

**Coverage**: 5 total, 0 mapped to tasks, 0 verified

---

## Success Criteria

- [ ] Notes reorganization takes less than 5 seconds on average.
- [ ] Reorganized notes are consistently shorter and more structured than the original input.
- [ ] No data loss occurs during the API call (if it fails, notes remain as they were).
