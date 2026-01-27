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
Base URL:  
https://pastebin-lite-sbof.onrender.com

---

## API Endpoints

### Create Paste
**POST** `/api/paste`

Request Body:
```json
{
  "content": "Hello Aganitha",
  "expiresInSeconds": 300,
  "maxViews": 3
}
 Response:
{
  "url": "https://pastebin-lite-sbof.onrender.com/api/paste/abcd1234"
}

GET /api/paste/:slug

Success Response:

json
{
  "content": "Hello Aganitha"
}
Error Responses:

404 – Paste not found

410 – Paste expired (time or view limit reached)

json

{
  "error": "Paste expired"
}

Expiry Logic
Time-based expiry: Content expires after the specified number of seconds

View-based expiry: Content expires once the maximum view count is reached

Expiry is enforced at read time to keep the system simple and stateless
