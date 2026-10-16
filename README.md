# Pocket Lawyer

Pocket Lawyer is a full-stack legal-information and document-assistance application. It helps people explore plain-language legal topics, save useful guides, and upload documents for text extraction and document-specific questions.

> Pocket Lawyer provides general legal information and document assistance. It is not a law firm and does not provide professional legal advice.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, JavaScript/JSX, Vite, React Router, Fetch API |
| Backend | Node.js, Express.js, REST API |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcryptjs |
| Document Processing | Multer, pdf-parse, Mammoth |

## Features

- User registration and login
- Explore and search legal topics
- View detailed legal topic information
- Bookmark useful legal topics
- Search history and personalized dashboard
- User profile management
- Document uploads and text extraction
- Document-specific question answering
- Question history and source passages
- Document ownership checks and deletion
- Admin dashboard and topic management

Supported document formats are PDF, DOC, DOCX, and TXT, with a 10 MB upload limit.

The document Q&A feature retrieves relevant passages from the uploaded document. If it cannot find enough relevant information, it indicates that rather than inventing an answer.

## Project Structure

```text
Pocket-Lawyer/
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── services/
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── utils/
├── tests/
├── server.js
├── package.json
├── pnpm-lock.yaml
├── vite.config.js
├── vitest.config.js
└── README.md
```

## Getting Started

### Prerequisites

- Node.js
- pnpm
- MongoDB

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/Radikaa34/Pocket-Lawyer.git
cd Pocket-Lawyer
```

**2. Install dependencies**

```bash
pnpm install
```

**3. Configure environment variables**

Create a `.env` file in the project root:

```env
MONGO_URI=mongodb://127.0.0.1:27017/pocket_lawyer
JWT_SECRET=replace-with-a-long-random-secret
PORT=3000
AI_API_KEY=
AI_API_URL=
CLIENT_ORIGIN=http://localhost:3000
```

Configure the values according to your local environment. Keep your `.env` file private and never commit credentials to GitHub.

**4. Start the application**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Check the project configuration for the exact environment variables and commands required by your setup.

## Available Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm start
pnpm test
```

These commands depend on the scripts configured in `package.json`.

## REST API

| Area | Endpoints | Access |
|---|---|---|
| Authentication | `/api/auth/register`, `/api/auth/login`, `/api/auth/me` | Public / JWT |
| Topics | `/api/topics`, `/api/topics/:id` | Public |
| Search | `/api/search?q=...` | Public |
| Bookmarks | `/api/bookmarks` | JWT |
| History | `/api/history` | JWT |
| Dashboard | `/api/dashboard` | JWT |
| Profile | `/api/users/profile` | JWT |
| Documents | `/api/documents` | JWT and ownership checks |
| Document Q&A | `/api/documents/:id/questions` | JWT and ownership checks |
| Admin | `/api/admin/stats`, `/api/admin/users` | JWT and admin role |
| Health | `/api/health` | Public |

## Security

- Passwords are hashed before storage.
- JWT authentication protects private routes.
- Document access is restricted to the authenticated owner.
- Admin endpoints require appropriate authorization.
- Upload size and file types are validated.
- Secrets are configured through environment variables.

## Future Improvements

- AI-powered legal document summarization
- Multilingual legal explanations
- Improved document analysis
- Enhanced search and document retrieval

## About Me

I'm Radikaa, a Computer Science and Engineering student interested in full-stack development and building practical applications that solve real-world problems.

## Disclaimer

Pocket Lawyer is an educational information tool. Its content is general and may not reflect the law in a particular jurisdiction or the facts of a particular situation. Users should consult a qualified legal professional for advice about their circumstances.
