# mcqBANK

A Next.js app for ingesting .docx question banks, enriching them with AI, and generating tests from a shared question store.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables in `.env.local`:
   ```bash
   MONGODB_URI="your MongoDB connection string"
   MONGODB_DB="mcqbank"
   # Optional: set to "json" to use a local JSON file store for development
   DATASTORE="mongodb"
   ```
3. Run the dev server:
   ```bash
   npm run dev
   ```

## Environment Variables

- `MONGODB_URI`: MongoDB connection string (MongoDB Atlas or local MongoDB).
- `MONGODB_DB`: MongoDB database name for the application.
- `DATASTORE` (optional): Set to `json` to use a local JSON file store for development; defaults to `mongodb`.

## Data Storage

- **Collection**: `questions`
- **Schema** (per question document):
  - `questionText` (string)
  - `options` (string[])
  - `correctAnswer` (string | null)
  - `category` (string)
  - `difficulty` (string)
  - `status` (`ready` | `needs-review`)
  - `source` (string, e.g. `docx`)
  - `createdAt` (timestamp)
- **JSON fallback** (when `DATASTORE=json`): `data/questions.json`

## Required Setup Notes

- For MongoDB Atlas, create a cluster and copy the connection string into `MONGODB_URI`.
- For local MongoDB, ensure the daemon is running and point `MONGODB_URI` at your local instance (e.g. `mongodb://localhost:27017`).
