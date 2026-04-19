# Quran Web App

A lightweight Express.js REST API that powers the Quran Web App with surah listings, chapter details, and keyword-based ayah search.

The service fetches Quran content from the quran-json CDN, reshapes it into a frontend-friendly format, and delivers faster repeated responses through in-memory caching.

## Table of Contents

### Backend

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [npm Scripts](#npm-scripts)
- [API Endpoints](#api-endpoints)
- [Utility Endpoints](#utility-endpoints)
- [cURL Examples](#curl-examples)
- [Caching Behavior](#caching-behavior)
- [Current Search Behavior and Limitations](#current-search-behavior-and-limitations)
- [Data Source](#data-source)
- [License](#license)

### Frontend

- [Frontend (Next.js App)](#frontend-nextjs-app)
- [Frontend Tech Stack](#frontend-tech-stack)
- [Frontend Location](#frontend-location)
- [Frontend Setup](#frontend-setup)
- [Frontend Environment Variable](#frontend-environment-variable)
- [Frontend Scripts](#frontend-scripts)
- [Frontend API Integration](#frontend-api-integration)
- [Frontend Notes](#frontend-notes)
- [Run Full App Locally](#run-full-app-locally)

## Features

- REST API for Quran content
- Surah list endpoint
- Surah-by-id endpoint with full ayahs
- Simple ayah search endpoint (`translation` + `text` matching)
- In-memory caching for faster repeated requests
- Health check endpoint
- CORS headers enabled for browser clients

## Tech Stack

- Node.js (ES modules)
- Express 4
- Native `fetch` (Node 18+)

## Project Structure

```text
backend/
  package.json
  src/
    index.js
    routes/
      quran.js
    controllers/
      quranController.js
    utils/
      searchIndex.js
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run in development mode

```bash
npm run dev
```

### 3. Run in production mode

```bash
npm start
```

The API starts at:

- `http://localhost:8080` (default)
- or `http://localhost:<PORT>` if `PORT` is set

## Environment Variables

- `PORT` (optional): server port, default is `8080`

Example:

```bash
PORT=5000 npm start
```

## npm Scripts

- `npm run dev` - Start server with file watch (`node --watch`)
- `npm start` - Start server normally
- `npm test` - Run Node test runner
- `npm run build` - Runs `tsc` (currently not required by runtime)

## API Endpoints

Base URL: `/api/quran`

### 1. Get all surahs

- **GET** `/api/quran/surahs`

Success response:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "الفاتحة",
      "transliteration": "Al-Fatihah",
      "translation": "The Opener",
      "type": "meccan",
      "total_verses": 7
    }
  ]
}
```

### 2. Get surah by ID

- **GET** `/api/quran/surahs/:id`
- Valid range: `1` to `114`

Success response:

```json
{
  "success": true,
  "data": {
    "surah": {
      "number": 1,
      "name": "The Opener",
      "arabicName": "الفاتحة",
      "transliteration": "Al-Fatihah",
      "translation": "The Opener",
      "revelation_type": "meccan",
      "numberOfAyahs": 7
    },
    "ayahs": [
      {
        "number": 1,
        "text": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        "translation": "In the Name of Allah—the Most Compassionate, Most Merciful.",
        "transliteration": "Bismillahir Rahmanir Raheem"
      }
    ]
  }
}
```

Error response (invalid surah id):

```json
{
  "success": false,
  "error": "Invalid surah number (1-114)"
}
```

### 3. Search ayahs

- **GET** `/api/quran/search?q=<keyword>`
- Query must be at least 2 characters

Success response:

```json
{
  "success": true,
  "data": [
    {
      "surahId": 1,
      "surahName": "The Opener",
      "ayahNumber": 1,
      "text": "...",
      "translation": "..."
    }
  ]
}
```

## Utility Endpoints

### Health check

- **GET** `/health`

```json
{
  "status": "OK",
  "timestamp": "2026-04-19T00:00:00.000Z"
}
```

### Root metadata

- **GET** `/`

Returns API name, version, and endpoint summary.

## cURL Examples

```bash
curl http://localhost:8080/health
curl http://localhost:8080/api/quran/surahs
curl http://localhost:8080/api/quran/surahs/2
curl "http://localhost:8080/api/quran/search?q=mercy"
```

## Caching Behavior

- Surah list is cached in memory after first request.
- Individual chapters are cached by key: `<chapterNum>_<lang>`.
- Cache resets when the server restarts.

## Current Search Behavior and Limitations

- Search currently scans only the first 10 surahs.
- Up to 5 matches are collected per surah.
- Final response is capped at 50 results.
- Search is simple substring matching on `text` and `translation`.

## Data Source

Data is fetched from:

- `https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/chapters/en/index.json`
- `https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/chapters/en/{chapter}.json`

## License

MIT

---

## Frontend (Next.js App)

The frontend is a Next.js application that consumes this backend API and renders Quran surahs, ayahs, and search results.

### Frontend Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- ESLint

### Frontend Location

```text
frontend/
  package.json
  app/
    page.tsx
    surah/
      [id]/
        page.tsx
    components/
    hooks/
    utils/
      api.ts
```

### Frontend Setup

From the `frontend` folder:

```bash
npm install
npm run dev
```

Frontend runs at:

- `http://localhost:3000`

### Frontend Environment Variable

- `NEXT_PUBLIC_API_URL` (optional)
  - Default used by the app: `http://localhost:8080/api`

Example:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### Frontend Scripts

- `npm run dev` - Start local development server
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run lint checks

### Frontend API Integration

The frontend API client is implemented in `frontend/app/utils/api.ts`.

Main methods currently aligned with backend routes:

- `fetchChapters()` -> `GET /api/quran/surahs`
- `fetchChapterVerses(chapterId)` -> `GET /api/quran/surahs/:id`
- `searchQuran(query)` -> `GET /api/quran/search?q=...`

### Frontend Notes

- Ensure backend is running before testing frontend data features.
- If backend runs on a different host/port, set `NEXT_PUBLIC_API_URL` accordingly.
- Some helper methods in the frontend API file are scaffolded for future endpoints and may require matching backend routes before use.

### Run Full App Locally

1. Start backend in `backend`:

```bash
npm install
npm run dev
```

2. Start frontend in `frontend`:

```bash
npm install
npm run dev
```

3. Open:

- Frontend: `http://localhost:3000`
- Backend health: `http://localhost:8080/health`
