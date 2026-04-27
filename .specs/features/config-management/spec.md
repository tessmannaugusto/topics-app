# Configuration & API Key Management Specification

## Problem Statement
Users need a way to provide their own API keys (starting with Gemini) to utilize the AI features of the app. These keys must be stored securely and associated with their authenticated profile for cross-device usage.

## Goals
- [ ] Users can access a "Configs" page via a gear icon on the main screen.
- [ ] Users can enter and save their Gemini API Key (v1).
- [ ] (Future v2) Users can switch between AI models.
- [ ] (Future v2) Users can choose the API for audio generation.
- [ ] API keys are stored securely on the backend and associated with the user account.

## Out of Scope
- [ ] Billing or usage tracking within the app.
- [ ] Validating the API key integrity on the client-side (validation happens during first use).
- [ ] Support for multiple keys of the same type.

---

## User Stories

### P1: Access Settings ⭐ MVP
**User Story**: As a user, I want to click a gear icon on the main page so that I can configure my preferences.
**Acceptance Criteria**:
1. WHEN the user is on the main page THEN they SHALL see a gear icon in the header.
2. WHEN the user clicks the gear icon THEN they SHALL be navigated to the **Configs Page**.

### P2: Manage Gemini API Key ⭐ MVP
**User Story**: As a user, I want to enter my Gemini API key so that I can use the topic generation features.
**Acceptance Criteria**:
1. WHEN the user is on the Configs Page THEN they SHALL see a field for "Gemini API Key".
2. WHEN the user enters a key and clicks "Save" THEN the key SHALL be sent to the backend and associated with their account.
3. WHEN the user returns to the page THEN they SHALL see a masked version of their key (e.g., `****...4a2b`).

---

## Backend Persistence & Security
1. **Database**: Update the `User` model in Prisma to include an optional `geminiApiKey` field (and generic placeholders for v2).
2. **Security**:
   - API keys MUST NOT be stored in plain text.
   - Keys SHALL be encrypted at rest in the PostgreSQL database using a server-side `ENCRYPTION_KEY`.
   - The backend SHALL only decrypt the key when making calls to Gemini on behalf of the user.
   - The API endpoint to *get* the config SHOULD only return the masked key to the client.

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| --- | --- | --- | --- |
| CONF-01 | Access Settings (Icon/Nav) | Specify | Pending |
| CONF-02 | Gemini API Key (Input/Save) | Specify | Pending |
| CONF-03 | Secure Backend Storage | Specify | Pending |
| CONF-04 | Masked Key Display | Specify | Pending |
| CONF-05 | (Future) Model Switching | Specify | Pending |
| CONF-06 | (Future) Audio Provider Choice | Specify | Pending |

**Status values**: Pending → In Design → In Tasks → Implementing → Verified
