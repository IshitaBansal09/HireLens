# HireLens

HireLens is an AI-powered interview-preparation tool. A candidate pastes a target job
description and provides either a resume (PDF) or a short self-description; the app then
generates a personalized interview report — a resume/job match score, likely technical and
behavioral questions (each with the interviewer's intention and a model answer), identified
skill gaps, and a day-by-day preparation roadmap. It can also generate a tailored, ATS-friendly
resume as a downloadable PDF for the given job description.

## Repository layout

```
HireLens/
├── Backend/     Node.js / Express REST API, MongoDB, Google Gemini integration
└── Frontend/    React (Vite) single-page app
```

Each half has its own `package.json` and runs as an independent process; there is no shared
tooling at the repo root.

## Tech stack

**Backend** — Node.js, Express 5, MongoDB via Mongoose, JWT auth stored in an HTTP cookie,
bcryptjs for password hashing, Multer for in-memory resume uploads, `pdf-parse` to extract
resume text, Google GenAI (`gemini-2.5-flash`) for report/resume generation, Puppeteer to
render generated HTML resumes to PDF, Pino for structured/redacted logging, Zod for AI response
schemas.

**Frontend** — React 19 with Vite, React Router v7 for routing, Axios for API calls, Sass for
styling. State is organized per feature using React Context + a matching custom hook
(`AuthProvider`/`useAuth`, `InterviewProvider`/`useInterview`).

## How it works

### Auth
- `POST /api/auth/register` and `POST /api/auth/login` create a JWT (`jsonwebtoken`, 1-day
  expiry) and set it as a cookie (`res.cookie("token", ...)`).
- `GET /api/auth/logout` clears the cookie and records the token in a `blacklistTokens`
  collection so it can't be replayed.
- `GET /api/auth/get-me` returns the current user; the frontend calls this once on load to
  restore a session.
- `authUser` middleware (`Backend/src/middlewares/auth.middleware.js`) verifies the cookie,
  rejects blacklisted tokens, and attaches the decoded payload to `req.user` for protected
  routes. The frontend's `Protected` component redirects to `/login` when no user is loaded.

### Interview report generation
- `POST /api/interview/` (protected, multipart) accepts a `resume` file plus `jobDescription`
  and/or `selfDescription`. The resume PDF is parsed to text (`pdf-parse`), and the combined
  input is sent to Gemini with a Zod-defined JSON schema
  (`Backend/src/services/ai.service.js`) covering match score, technical/behavioral questions,
  skill gaps, and a preparation plan. The result is persisted to MongoDB
  (`interviewReport.model.js`) alongside the raw inputs.
- `GET /api/interview/` lists the logged-in user's past reports (summary fields only).
- `GET /api/interview/report/:interviewId` fetches one full report, scoped to its owner.
- `GET /api/interview/resume/pdf/:interviewReportId` asks Gemini to produce a tailored resume
  as HTML, then renders it to a PDF with Puppeteer and streams it back as an attachment.

### Frontend flow
- `/login`, `/register` — auth forms.
- `/` (protected) — `Home` page: paste a job description, upload a resume or type a
  self-description, and trigger report generation; also lists the user's past reports.
- `/interview/:interviewId` (protected) — `Interview` page: tabs for technical questions,
  behavioral questions, and the preparation roadmap, plus a sidebar with match score and skill
  gaps, and a button to download the tailored resume PDF.

## API summary

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create a user (username, email, password) |
| POST | `/api/auth/login` | Public | Log in with email + password |
| GET | `/api/auth/logout` | Public | Clear session cookie, blacklist the token |
| GET | `/api/auth/get-me` | Private | Get the logged-in user's details |
| POST | `/api/interview/` | Private | Generate a new interview report (multipart: `resume`, `jobDescription`, `selfDescription`) |
| GET | `/api/interview/` | Private | List the user's interview reports |
| GET | `/api/interview/report/:interviewId` | Private | Get one full interview report |
| GET | `/api/interview/resume/pdf/:interviewReportId` | Private | Generate and download a tailored resume PDF |

## Getting started

### Prerequisites
- Node.js (v18+ recommended)
- A MongoDB connection string (local instance or Atlas)
- A Google GenAI (Gemini) API key

### Backend

```bash
cd Backend
npm install
```

Create a `Backend/.env` with:

```
PORT=3000
MONGO_URI=<your MongoDB connection string>
JWT_SECRET=<a random secret>
GOOGLE_GENAI_API_KEY=<your Gemini API key>
```

Run it:

```bash
npm start
```

This starts the Express server (via `nodemon`) on `PORT` (default `3000`), connects to
MongoDB, and logs via Pino.

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

Vite serves the app on `http://localhost:5180` (fixed port, configured in `vite.config.js`).

> **Note:** `Frontend/src/features/auth/services/auth.api.js` and
> `Frontend/src/features/interview/services/interview.api.js` currently hardcode their Axios
> `baseURL` to the deployed backend (`https://hirelens-6gdy.onrender.com`) rather than reading
> an environment variable. To run the frontend against your local backend, point that
> `baseURL` at `http://localhost:3000` (matching the `PORT` above) before starting `npm run dev`.
> The backend's CORS config already allows `http://localhost:5173` and `http://localhost:5180`.

Other frontend scripts: `npm run build` (production build), `npm run lint` (ESLint),
`npm run preview` (preview a production build).

## Security notes

- `Backend/.env` is git-ignored — don't commit real credentials there.
- Passwords are hashed with bcrypt before storage; JWTs and cookies are redacted from logs
  (`Backend/src/config/logger.js`).
- Uploaded resumes are limited to 3MB and kept in memory only for the duration of the request.
