# Meeting Notes Cleaner

A lightweight web application that transforms messy meeting notes into clean, scan-friendly format with bold labels.

## Features

- **Filler Removal**: Automatically removes filler words (um, like, basically, etc.)
- **Duplicate Merging**: Identifies and merges duplicate or similar notes
- **Label Detection**: Recognizes explicit labels (Action Item, Decision, Blocker, etc.)
- **Label Inference**: Infers missing labels based on content keywords
- **Clean Output**: Formats notes as `**Label:** Content per line`

## Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Testing**: Jest with ts-jest
- **Container**: Docker with multi-stage build

## Project Structure

```
├── src/
│   ├── server.ts           # Express server entry point
│   ├── routes/
│   │   └── notes.ts        # API routes with validation
│   ├── services/
│   │   └── notesCleaner.ts # Core cleaning logic
│   └── public/
│       ├── index.html      # Frontend UI
│       ├── styles.css      # Styling
│       └── app.js          # Frontend JavaScript
├── tests/
│   ├── notesCleaner.test.ts # Unit tests for cleaner service
│   └── api.test.ts          # API integration tests
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## Setup & Run

### Prerequisites

- Node.js 18+ (or Docker)
- npm

### Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Build the project**:
   ```bash
   npm run build
   ```

3. **Start the server**:
   ```bash
   npm start
   ```

4. **Open in browser**:
   ```
   http://localhost:3000
   ```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Using Docker

**Build and run with Docker Compose**:
```bash
docker-compose up --build
```

**Or build manually**:
```bash
docker build -t meeting-notes-cleaner .
docker run -p 3000:3000 meeting-notes-cleaner
```

## API Reference

### POST /api/notes/clean

Cleans raw meeting notes and returns formatted output.

**Request**:
```json
{
  "notes": "- um, action item: John will update the docs\n- Decision: We agreed to use TypeScript"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "formatted": "**Action Item:** John will update the docs.\n**Decision:** We agreed to use TypeScript.",
    "notes": [
      { "label": "Action Item", "content": "John will update the docs" },
      { "label": "Decision", "content": "We agreed to use TypeScript" }
    ],
    "stats": {
      "inputLength": 85,
      "outputLength": 89,
      "itemCount": 2
    }
  }
}
```

### GET /api/notes/health

Health check endpoint.

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Input Validation

- Notes field is required
- Must be a non-empty string
- Maximum length: 50,000 characters

## Supported Labels

The cleaner recognizes these explicit labels:
- Action Item / Task / TODO
- Decision
- Next Step
- Follow-up
- Question
- Note
- Blocker
- Deadline
- Attendee
- Agenda
- Update
- Idea
- Risk
- Owner

## Example

**Input**:
```
- um, so we decided to launch next week
- action item: John will update the docs
- basically the API is working but we need more tests
- John will update documentation
- question: when is the deadline?
```

**Output**:
```
**Decision:** We decided to launch next week.
**Action Item:** John will update the docs.
**Note:** The API is working but we need more tests.
**Question:** When is the deadline?
```

## License

MIT
