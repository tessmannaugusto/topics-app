# Tasks: AI Script Generation

## Status

- Total: 6
- Complete: 5
- Remaining: 1
- Blocked: 0

## Task List

### Backend Setup
- [x] [SCRIPT-T01] Setup a basic Node.js/Express server in a `/backend` directory. (Depends on: -) [Done when: Server runs locally and responds to a health check.] [Tests: -] [Gate: -]
- [x] [SCRIPT-T02] Implement `/api/generate-script` endpoint with AI integration (OpenAI or Gemini). (Depends on: SCRIPT-T01) [Done when: Endpoint receives notes and returns a generated script.] [Tests: Manual curl test with a sample note.] [Gate: -]

### Mobile App Integration
- [x] [SCRIPT-T03] Update `TopicDetail` UI to include a "Generate Script" button. (Depends on: -) [Done when: Button is visible and only enabled if notes are present.] [Tests: -] [Gate: -]
- [x] [SCRIPT-T04] Implement the frontend logic to call the backend API and update storage. (Depends on: SCRIPT-T02, SCRIPT-T03) [Done when: Clicking the button calls the API, shows a loader, and saves the result to AsyncStorage.] [Tests: -] [Gate: -]
- [x] [SCRIPT-T05] Add "Regenerate" functionality with a confirmation dialog if a script already exists. (Depends on: SCRIPT-T04) [Done when: User can replace an existing script with a new one.] [Tests: -] [Gate: -]

### Validation
- [ ] [SCRIPT-T06] Perform end-to-end test of script generation. (Depends on: SCRIPT-T04) [Done when: A full flow from creating a topic to generating a script works correctly.] [Tests: Manual UAT.] [Gate: -]
