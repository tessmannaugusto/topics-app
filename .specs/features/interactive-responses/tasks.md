# Interactive Responses Tasks

## Frontend Tasks

- [ ] **Task IR-1: Implement Answer Input UI**
    - **What**: Add a `TextInput` field and "Submit" button for the current question in `app/[id].tsx`.
    - **Done when**: User can type an answer and see it on screen.
    - **Verification**: UI displays the input correctly.

- [ ] **Task IR-2: Implement Answer Persistence**
    - **What**: Update the topic storage when the user submits their answer.
    - **Done when**: `topic.questions[i].answer` is saved to `AsyncStorage`.
    - **Verification**: Navigating away and back to the topic retains the submitted answer.

- [ ] **Task IR-3: Integrate Voice Recording for Answers**
    - **What**: Use `voice-recorder.ts` to record audio for the current question's answer.
    - **Done when**: Clicking a mic button starts/stops recording.
    - **Verification**: Mic button toggles state and console shows recording completion.

- [ ] **Task IR-4: Call Transcription for Voice Answers**
    - **What**: Send recorded audio to `/api/transcribe` and populate the answer input field with the text.
    - **Done when**: Spoken answer appears as text in the input.
    - **Verification**: Transcribed text matches spoken input (approximately).

- [ ] **Task IR-5: Add "Answered" Status Indicator**
    - **What**: Show a "Question Answered" label or badge when an answer exists.
    - **Done when**: User sees feedback that their answer was saved.
    - **Verification**: UI visual feedback.
