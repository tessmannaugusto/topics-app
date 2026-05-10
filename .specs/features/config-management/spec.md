# Configuration & API Key Management Specification

## Problem Statement
Users need a way to provide their own API keys (starting with Gemini) to utilize the AI features of the app. They also need to be able to select which AI model to use for their requests. Access to these settings should be convenient and available from anywhere in the app.

## Goals
- [x] Users can enter and save their Gemini API Key (v1).
- [ ] Users can access a "Configs" page via a gear icon present in the header of all pages.
- [ ] Users can choose between main Gemini models (1.5 Flash, 1.5 Pro, 2.0 Flash) via a dropdown in the Configs page.
- [ ] (Future v2) Users can choose the API for audio generation.
- [ ] (Future v2) API keys are stored securely on the backend and associated with the user account.

## Out of Scope
- [ ] Billing or usage tracking within the app.
- [ ] Validating the API key integrity on the client-side (validation happens during first use).
- [ ] Support for multiple keys of the same type.

---

## User Stories

### P1: Global Access to Settings ⭐
**User Story**: As a user, I want to see a gear icon in the header of every page so that I can quickly access my settings without returning to the home screen.
**Acceptance Criteria**:
1. WHEN the user is on any page THEN they SHALL see a gear icon in the top right of the header.
2. WHEN the user clicks the gear icon THEN they SHALL be navigated to the **Configs Page**.

### P2: Gemini Model Selection ⭐
**User Story**: As a user, I want to choose which Gemini model is used for AI generation so that I can balance speed/cost and quality.
**Acceptance Criteria**:
1. WHEN the user is on the Configs Page THEN they SHALL see a dropdown for "AI Model Selection".
2. THE dropdown SHALL include: "Gemini 1.5 Flash", "Gemini 1.5 Pro", and "Gemini 2.0 Flash".
3. WHEN the user selects a model and saves THEN that model SHALL be used for all subsequent AI requests (script generation, question generation, evaluation).

### P3: Manage Gemini API Key ⭐ MVP
**User Story**: As a user, I want to enter my Gemini API key so that I can use the topic generation features.
**Acceptance Criteria**:
1. WHEN the user is on the Configs Page THEN they SHALL see a field for "Gemini API Key".
2. WHEN the user enters a key and clicks "Save" THEN the key SHALL be stored locally (v1) and masked on return.

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| --- | --- | --- | --- |
| CONF-01 | Global Access (Gear Icon) | Specify | In Design |
| CONF-02 | Gemini API Key (Input/Save) | Specify | Verified |
| CONF-03 | Model Selection (Dropdown) | Specify | In Design |
| CONF-04 | Masked Key Display | Specify | Verified |
| CONF-05 | Model Usage in APIs | Specify | In Design |
| CONF-06 | (Future) Secure Backend Storage | Specify | Pending |
| CONF-07 | (Future) Audio Provider Choice | Specify | Pending |

**Status values**: Pending → In Design → In Tasks → Implementing → Verified
