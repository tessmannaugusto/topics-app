# Structure

```
/
├── backend/            # Node.js/Express server (Gemini/TTS logic)
│   ├── src/
│   │   ├── api/        # Endpoint handlers
│   │   └── index.ts    # Server entry point
│   └── package.json
├── frontend/           # React Native / Expo application
│   ├── app/            # Expo Router screens
│   ├── assets/         # App assets (icons, images)
│   ├── src/            # Application source code
│   │   ├── storage/    # Persistence logic
│   │   └── config.ts   # API configuration
│   └── package.json
├── .gemini/            # Gemini CLI configuration and skills
└── .specs/             # Project and feature specifications
    ├── project/        # Vision, Roadmap, State
    ├── features/       # Feature-specific specs (Topic, Script)
    └── codebase/       # Architecture, Stack, Conventions
```
