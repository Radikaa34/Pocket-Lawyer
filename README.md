# Pocket Lawyer

Pocket Lawyer is a full-stack legal-information and document-assistance application. It helps people explore plain-language legal topics, save useful guides, and upload documents for text extraction and document-specific questions.

> Pocket Lawyer provides general legal information and document assistance. It is not a law firm and does not provide professional legal advice.

## Final stack

| Layer | Technology |
| --- | --- |
| Frontend | React, JavaScript/JSX, Vite, React Router, Fetch API |
| Backend | Node.js, Express.js, REST API |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcryptjs |
| Document processing | Multer, pdf-parse, Mammoth |

The active application contains no TypeScript, TSX, MySQL, mysql2, Drizzle, tRPC, or wouter implementation.

## Features

The application preserves the existing Pocket Lawyer UI and pages: Home, Explore, Search, Topic Details, Login, Register, Dashboard, Bookmarks, Documents, Document Details, Profile, Admin, and About. The backend provides authentication, topics, search, bookmarks, search history, profiles, admin endpoints, document uploads, extraction status, document-specific Q&A, source passages, question history, ownership checks, and document deletion.

Supported uploads are PDF, DOC, DOCX, and TXT, with a 10 MB limit. Extracted text is stored in the owner-scoped MongoDB document record. Q&A ranks relevant passages from that document only. When no meaningful passage matches, it responds that it could not find enough information in the document rather than inventing an answer.

## Windows setup

1. Install the current Node.js LTS release from [nodejs.org](https://nodejs.org/).
2. Install pnpm with `npm install --global pnpm`.
3. Extract the ZIP archive.
4. Open Command Prompt or PowerShell in the extracted project folder.
5. Run `pnpm install`.
6. Create a local `.env` file from the environment template described below.
7. Add a reachable MongoDB URI to `MONGO_URI`.
8. Add a long random value to `JWT_SECRET`.
9. Add `AI_API_KEY` only if an external AI provider is later configured; the current deterministic document retrieval works without it.
10. Run `pnpm dev`.
11. Open <http://localhost:3000>.

The scripts use `cross-env`, so `pnpm dev` and `pnpm start` work in Windows Command Prompt, PowerShell, macOS, and Linux.

## Environment variables

Create `.env` in the project root. Do not commit it or place private credentials in the ZIP.

```env
MONGO_URI=mongodb://127.0.0.1:27017/pocket_lawyer
JWT_SECRET=replace-with-a-long-random-secret
PORT=3000
AI_API_KEY=
AI_API_URL=
CLIENT_ORIGIN=http://localhost:3000
```

`MONGO_URI`, `JWT_SECRET`, and `PORT` are the core runtime variables. MongoDB must be running and reachable at the configured URI. If MongoDB is unavailable, the Express server still starts for health and public shell checks, reports the connection failure clearly, and skips topic seeding rather than buffering indefinitely. Authentication and persistence require a working MongoDB connection and JWT secret.

## Commands

```bash
pnpm install
pnpm dev
```

Production build and start:

```bash
pnpm build
pnpm start
```

Tests:

```bash
pnpm test
```

`pnpm test` runs the Node tests for bcrypt and source-grounded document Q&A, plus the Vitest health check that confirms the configured MongoDB URI is recognized.

## REST API

| Area | Endpoints | Access |
| --- | --- | --- |
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` | Public / JWT |
| Topics | `GET /api/topics`, `GET /api/topics/:id` | Public |
| Search | `GET /api/search?q=...` | Public |
| Bookmarks | `GET/POST /api/bookmarks`, `DELETE /api/bookmarks/:topicId` | JWT |
| History | `GET/POST /api/history`, `DELETE /api/history/:id` | JWT |
| Dashboard | `GET /api/dashboard` | JWT |
| Profile | `GET/PUT /api/users/profile` | JWT |
| Documents | `POST /api/documents/upload`, `GET /api/documents`, `GET /api/documents/:id`, `DELETE /api/documents/:id` | JWT + owner |
| Document Q&A | `GET/POST /api/documents/:id/questions` | JWT + owner |
| Admin | `GET /api/admin/stats`, `GET /api/admin/users`, topic CRUD endpoints | JWT + admin |
| Health | `GET /api/health` | Public |

## Security and ownership

Passwords are hashed with bcryptjs before persistence. JWTs are signed from `JWT_SECRET`; protected routes load the user from MongoDB and reject missing or invalid tokens. Documents and document questions are always queried by both resource ID and authenticated user ID, preventing cross-user access. Admin routes require the `admin` role. Multer validates upload size and the controller validates MIME type before extraction. Secrets are environment-driven and are not hardcoded into the source.

## Production serving

`pnpm build` runs Vite and produces `dist/public/index.html` plus bundled assets. In production, Express serves `dist/public` and handles the SPA fallback. In development, Express mounts Vite middleware and serves the application from `http://localhost:3000`.

## ZIP contents

The runnable source archive should include `package.json`, `pnpm-lock.yaml`, `client/`, `server.js`, `server/`, `vite.config.js`, `vitest.config.js`, `tests/`, `README.md`, and the project configuration files. It should exclude `node_modules`, `dist`, `.env`, logs, caches, `.git`, and private credentials.

## Disclaimer

Pocket Lawyer is an educational information tool. Its content is general and may not reflect the law in a particular jurisdiction or the facts of a particular situation. Users should consult a qualified legal professional for advice about their circumstances.
