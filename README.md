# Pastebin Lite – Take Home Exercise (Aganitha)

## Overview
This project is a backend-focused Pastebin-like web application built as part of the Aganitha Full Stack Developer take-home exercise.

The application allows users to:
- Create and store text content
- Generate a shareable link for the content
- Retrieve content using the generated link
- Optionally expire content based on time or number of views

The solution is intentionally backend-only, as the evaluation is primarily done using automated tests against the deployed APIs.

---

## Tech Stack
- Backend: Node.js, Express
- Database: PostgreSQL (Neon)
- ORM: Prisma
- Hosting: Render

---

## Deployed Application
**Base URL:**  
https://pastebin-lite-sbof.onrender.com

---

## Health Check
**GET** `/api/healthz`

Response:
```json
{ "ok": true }
API Endpoints

POST /api/pastes

Request Body:
json
{
  "content": "Hello Aganitha",
  "ttl_seconds": 300,
  "max_views": 3
}

Response:
json

{
  "id": "abcd1234",
  "url": "https://pastebin-lite-sbof.onrender.com/p/abcd1234"
}

Fetch Paste (API)
GET /api/pastes/:id

Success Response:

json
{
  "content": "Hello Aganitha",
  "remaining_views": 2,
  "expires_at": "2026-01-01T00:00:00.000Z"
}
Error Response:

404 Not Found (paste expired or does not exist)

View Paste (HTML)
GET /p/:id

Returns the paste content rendered as HTML.

Expiry Logic
Time-based expiry: Paste expires after the specified number of seconds (ttl_seconds)

View-based expiry: Paste expires once the maximum number of views (max_views) is reached

Expiry is enforced at read time

All unavailable pastes return 404 Not Found
