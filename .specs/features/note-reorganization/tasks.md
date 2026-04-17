# Tasks: Note Reorganization

## Status

- Total: 6
- Complete: 0
- Remaining: 6
- Blocked: 0

## Task List

### Backend Implementation
- [ ] [REORG-T01] Create `backend/src/api/reorganize-notes.ts` with the Gemini logic. (Depends on: -) [Done when: `/api/reorganize-notes` exists and returns a reorganized string.] [Tests: Manual curl test.] [Gate: -]
- [ ] [REORG-T02] Register the new route in the backend router. (Depends on: REORG-T01) [Done when: Route is reachable and responds to POST requests.] [Tests: -] [Gate: -]

### Mobile App Integration
- [ ] [REORG-T03] Update `frontend/app/[id].tsx` to add `handleReorganizeNotes` function. (Depends on: REORG-T02) [Done when: Function is available to call the new API and update storage.] [Tests: -] [Gate: -]
- [ ] [REORG-T04] Add "ORGANIZE NOTES" button to the `TopicDetail` UI. (Depends on: REORG-T03) [Done when: Button is visible and correctly triggers the reorganize function.] [Tests: -] [Gate: -]
- [ ] [REORG-T05] Implement loading state and error handling for the reorganization process. (Depends on: REORG-T04) [Done when: User sees a loading indicator while the notes are being reorganized and an alert on failure.] [Tests: -] [Gate: -]

### Validation
- [ ] [REORG-T06] Perform end-to-end test of note reorganization. (Depends on: REORG-T05) [Done when: Messy notes are successfully cleaned up and saved in the app.] [Tests: Manual UAT.] [Gate: -]
