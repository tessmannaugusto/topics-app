# AI Script Generation Specification

## Problem Statement

Raw study notes are often not optimal for audio listening. They can be fragmented, list-heavy, or lacking context. To create a high-quality "audiobook" experience, notes need to be transformed into a narrative script that is engaging and informative.

## Goals

- [ ] Automatically transform topic notes into an "audiobook-style" script.
- [ ] Ensure the script is natural-sounding and easy to follow when spoken.
- [ ] Include practical examples and explanations to clarify complex points.
- [ ] Allow the user to regenerate the script if they are not satisfied.

## Out of Scope

- [ ] Manual editing of the AI-generated script (v1: only regeneration).
- [ ] Multiple AI persona options (v1: single educational persona).
- [ ] Handling extremely long notes (>10,000 characters) - to be addressed later.

---

## User Stories

### P1: Generate Educational Script ⭐ MVP

**User Story**: As a student, I want my notes to be transformed into a script that reads like a professional educator explaining a topic, so that I can learn more effectively by listening.

**Why P1**: This is the core value proposition—turning raw data into a learning experience.

**Acceptance Criteria**:

1. WHEN the user requests a script for a topic THEN the system SHALL send the notes to an AI model.
2. THE AI model SHALL return a script that:
    - Is written in a narrative, educational tone.
    - Includes "vocal markers" or pauses if appropriate (TBD based on TTS).
    - Translates complex lists into flowing explanations.
    - Adds at least one practical example for key concepts.
3. THE system SHALL store the generated script in the topic's `aiScript` field.
4. THE user SHALL be able to see the generated script in the topic detail view.

---

## Edge Cases

- WHEN notes are empty THEN the "Generate Script" button SHALL be disabled.
- WHEN the AI API fails THEN the system SHALL show an error message and allow retry.
- WHEN a script already exists THEN the system SHALL ask for confirmation before overwriting it.

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| --- | --- | --- | --- |
| SCRIPT-01 | P1: AI script generation logic | Design | Pending |
| SCRIPT-02 | P1: "Generate Script" button in UI | Design | Pending |
| SCRIPT-03 | P1: Persistence of generated script | Design | Pending |
| SCRIPT-04 | P1: Confirmation for overwriting script | Design | Pending |

**Status values**: Pending → In Design → In Tasks → Implementing → Verified

**Coverage**: 4 total, 0 mapped to tasks, 4 unmapped

---

## Success Criteria

- [ ] Generated scripts are consistently rated as "helpful" and "natural" by the user.
- [ ] Script generation takes less than 15 seconds on average.
- [ ] No notes are lost during the transformation process.
