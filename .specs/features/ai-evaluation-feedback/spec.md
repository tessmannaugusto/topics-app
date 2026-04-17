# AI Evaluation & Feedback Specification

## Problem Statement

Providing an answer is a great step, but without feedback, the user doesn't know if their recall was accurate. They need a way to understand what they missed or what they got right, reinforcing the correct information.

## Goals

- [ ] Compare the user's answer (text) to the topic's content (notes/script).
- [ ] Provide an evaluation of correctness (e.g., Correct, Partially Correct, Incorrect).
- [ ] Provide constructive feedback explaining what was correct or what was missed.
- [ ] Store the evaluation results locally as part of the question/answer data.
- [ ] Provide a clean UI for displaying the evaluation and feedback.

## Out of Scope

- [ ] Voice-based feedback (v1: Text display only).
- [ ] More complex grading (e.g., scores, percentages) (v1: Qualitative feedback only).
- [ ] Multi-turn dialogue with the AI (v1: Single feedback pass per answer).

---

## User Stories

### P1: Receive AI Evaluation ⭐ MVP

**User Story**: As a student, I want the app to tell me if my answer was correct, so that I can know if I understood the concept correctly.

**Why P1**: This is the core feedback loop that completes the active recall cycle.

**Acceptance Criteria**:

1. WHEN the user submits an answer THEN the system SHALL send the question, the user's answer, and the topic content to the AI (Gemini).
2. THE system SHALL receive an evaluation object in a structured format (JSON).
3. THE system SHALL store this evaluation (status and feedback text) with the answer.
4. THE user SHALL see an immediate summary of their performance (e.g., a "Status" label).

---

### P2: View Detailed Feedback

**User Story**: As a student, I want to read a brief explanation of *why* my answer was right or wrong, so that I can learn from my mistakes.

**Why P2**: Qualitative feedback is more valuable than a simple "correct/incorrect" label for learning.

**Acceptance Criteria**:

1. THE system SHALL display the AI's feedback text prominently in the UI after the evaluation is complete.
2. THE feedback SHALL include specific points missed or concepts that were misunderstood.
3. THE user SHALL be able to dismiss or revisit the feedback later.

---

### P3: Track Evaluation History

**User Story**: As a student, I want to see my previous evaluations when I revisit an answered question, so that I can see my progress over time.

**Why P3**: Essential for review and long-term learning progress.

**Acceptance Criteria**:

1. THE system SHALL display the most recent evaluation (if any) when the user views an answered question.
2. THE user SHALL be able to re-submit their answer for a fresh evaluation.

---

## Edge Cases

- WHEN the user updates their answer THEN the system SHALL invalidate the previous evaluation and prompt for a new one.
- WHEN the AI returns malformed JSON THEN the system SHALL show an error and allow the user to retry the evaluation.
- WHEN there is no network connection THEN the system SHALL show an offline error.

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| --- | --- | --- | --- |
| REQ-AEF-01 | P1: Backend integration with AI (Gemini) for evaluation | Specify | Pending |
| REQ-AEF-02 | P1: Data schema update to include `evaluation` for answers | Specify | Pending |
| REQ-AEF-03 | P1/P2: UI for displaying evaluation status and feedback | Specify | Pending |
| REQ-AEF-04 | P1: Trigger for evaluation (on answer submission or separate button) | Specify | Pending |
| REQ-AEF-05 | P3: Persistent storage of evaluations in local storage | Specify | Pending |

**Status values**: Pending → In Design → In Tasks → Implementing → Verified

**Coverage**: 5 total, 0 mapped to tasks, 5 unmapped

---

## Success Criteria

- [ ] Evaluation and feedback generation takes less than 15 seconds.
- [ ] Feedback is constructive and directly addresses the user's answer.
- [ ] The evaluation status (Correct/Partial/Incorrect) is generally accurate.
- [ ] Evaluations persist across sessions.
