# AI Question Generator Specification

## Problem Statement

Passive learning (listening to the generated audio) is effective, but active recall is the key to deep learning. Users need a way to test their knowledge of the topic content through questions that challenge their understanding.

## Goals

- [ ] Automatically generate high-quality, relevant questions based on the topic's notes or AI-generated script.
- [ ] Provide a set of 3-5 questions that cover the main points of the material.
- [ ] Allow the user to view and cycle through these questions in the app.
- [ ] Store the generated questions locally as part of the topic data.
- [ ] Allow the user to regenerate questions if they want a different set.

## Out of Scope

- [ ] Accepting user answers (Milestone 2: Interactive Responses).
- [ ] Evaluating user answers (Milestone 2: AI Evaluation & Feedback).
- [ ] Multiple-choice questions (v1: Open-ended questions only).
- [ ] Voice-based question interaction (v1: Text display only).

---

## User Stories

### P1: Generate Questions from Content ⭐ MVP

**User Story**: As a student, I want the app to generate questions about my notes, so that I can test if I actually understood the material.

**Why P1**: This is the core engine for active recall in the app.

**Acceptance Criteria**:

1. WHEN the user requests question generation THEN the system SHALL send the topic notes (and/or script) to the AI (Gemini).
2. THE system SHALL receive a list of 3-5 open-ended questions in a structured format (JSON).
3. THE system SHALL store these questions in the topic's `questions` field.
4. THE user SHALL see the first question displayed on the screen.

---

### P2: View and Cycle Questions

**User Story**: As a student, I want to see one question at a time and move to the next one, so that I can focus on one concept before moving on.

**Why P2**: A clean UI prevents overwhelm and encourages focused thinking.

**Acceptance Criteria**:

1. THE system SHALL display one question prominently in the UI.
2. THE user SHALL be able to click "Next" or "Previous" to cycle through the generated questions.
3. THE UI SHALL indicate the total number of questions (e.g., "Question 1 of 5").

---

## Edge Cases

- WHEN the topic notes are too short (e.g., < 50 characters) THEN the "Generate Questions" button SHALL be disabled or show a warning.
- WHEN the AI returns malformed JSON THEN the system SHALL show an error and allow the user to retry.
- WHEN there is no network connection THEN the system SHALL show an offline error.
- WHEN the user updates the topic notes THEN the system SHALL prompt the user that existing questions may be outdated.

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| --- | --- | --- | --- |
| REQ-AQG-01 | P1: Backend integration with AI (Gemini) for question generation | Specify | Pending |
| REQ-AQG-02 | P1: Topic data schema update to include `questions` | Specify | Pending |
| REQ-AQG-03 | P1/P2: UI component to display and cycle questions | Specify | Pending |
| REQ-AQG-04 | P1: Trigger for question generation in Topic Detail | Specify | Pending |
| REQ-AQG-05 | P1: Regenerate questions functionality | Specify | Pending |

**Status values**: Pending → In Design → In Tasks → Implementing → Verified

**Coverage**: 5 total, 0 mapped to tasks, 5 unmapped

---

## Success Criteria

- [ ] Question generation takes less than 10 seconds.
- [ ] Questions are directly related to the provided topic content.
- [ ] The questions are clear and challenge the user to recall specific facts or concepts.
- [ ] Questions persist across app restarts.
