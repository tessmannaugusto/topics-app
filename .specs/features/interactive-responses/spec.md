# Interactive Responses Specification

## Problem Statement

Generating questions is only the first half of active recall. The second half is for the user to actually provide an answer. This reinforces learning by forcing the user to retrieve information and articulate it.

## Goals

- [ ] Allow the user to provide text answers to a specific question.
- [ ] Allow the user to provide voice answers (STT) to a specific question.
- [ ] Store user answers locally as part of the topic/question data.
- [ ] Provide a clean UI for recording and submitting answers.
- [ ] Maintain the state of answered vs. unanswered questions.

## Out of Scope

- [ ] Evaluating user answers (Milestone 2: AI Evaluation & Feedback).
- [ ] Comparing answers to correct information (Milestone 2: AI Evaluation & Feedback).
- [ ] Multiple-choice selection (v1: Open-ended input only).

---

## User Stories

### P1: Provide Text Answers ⭐ MVP

**User Story**: As a student, I want to type my answer to a question, so that I can practice explaining the concepts in my own words.

**Why P1**: Simplest form of interaction that doesn't require audio processing.

**Acceptance Criteria**:

1. WHEN a question is displayed THEN the user SHALL see a text input field for their answer.
2. THE user SHALL be able to submit their text answer.
3. THE system SHALL store the text answer associated with that specific question.
4. THE UI SHALL indicate that the question has been answered (e.g., status label "Answered").

---

### P2: Provide Voice Answers (STT)

**User Story**: As a student, I want to speak my answer to a question, so that I can practice recall while on the go (hands-free).

**Why P2**: Aligns with the app's "audiobook" and "hands-free" vision.

**Acceptance Criteria**:

1. WHEN a question is displayed THEN the user SHALL see a microphone button to record their answer.
2. THE system SHALL use the existing `voice-recorder.ts` and STT backend to transcribe the voice answer.
3. THE system SHALL populate the text input field with the transcription.
4. THE user SHALL be able to edit the transcription before final submission.

---

### P3: Track Answer History

**User Story**: As a student, I want to see my previous answers when I revisit a question, so that I can see my progress or review what I thought before.

**Why P3**: Essential for review and long-term learning.

**Acceptance Criteria**:

1. THE system SHALL display the most recent answer (if any) when the user navigates back to a question.
2. THE user SHALL be able to update their answer for an already answered question.

---

## Edge Cases

- WHEN the user tries to submit an empty answer THEN the system SHALL show a warning.
- WHEN STT transcription fails THEN the system SHALL notify the user and allow manual text entry.
- WHEN the user changes the topic notes THEN existing answers SHALL remain but MAY be flagged as potentially irrelevant (deferred to Milestone 3).

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| --- | --- | --- | --- |
| REQ-IR-01 | P1: Data schema update to include `answers` for questions | Specify | Pending |
| REQ-IR-02 | P1: UI for text input and submission | Specify | Pending |
| REQ-IR-03 | P2: Integration with `voice-recorder.ts` and STT backend | Specify | Pending |
| REQ-IR-04 | P2: UI for recording voice answers | Specify | Pending |
| REQ-IR-05 | P3: Persistent storage of answers in local storage | Specify | Pending |

**Status values**: Pending → In Design → In Tasks → Implementing → Verified

**Coverage**: 5 total, 0 mapped to tasks, 5 unmapped

---

## Success Criteria

- [ ] STT transcription is accurate (handled by existing STT infrastructure).
- [ ] Submitting an answer is responsive (immediate UI feedback).
- [ ] Answers are correctly mapped to the specific question and topic.
- [ ] Data persists across sessions.
