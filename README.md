# Tawjih 2026 — Plateforme d'orientation pédagogique

Fullstack refactor of the original monolithic [`legacy/index.html`](legacy/index.html).

## Stack

- **Backend** — Node.js + Express + MongoDB (Mongoose)
- **Frontend** — React (Vite) + Tailwind CSS + React Router + Zustand + TanStack Query
- **i18n** — `react-i18next` (ar / fr / en), RTL pour l'arabe

## Prerequisites

- Node.js 18+
- MongoDB running locally (default: `mongodb://localhost:27017/tawjih2026`)

## Quickstart

```bash
# 1) Install
npm install
(cd backend  && npm install && cp .env.example .env)
(cd frontend && npm install && cp .env.example .env)

# 2) Extract data from legacy/index.html (one-shot)
npm --prefix backend run extract

# 3) Seed MongoDB
npm --prefix backend run seed

# 4) Start both dev servers
npm run dev
# Backend  → http://localhost:5000
# Frontend → http://localhost:5173
```

## Admin

Visit `http://localhost:5173/admin/login` and enter the `ADMIN_KEY` from `backend/.env`.

## API quick reference

| Method | Route | Notes |
|---|---|---|
| GET  | `/api/health` | health check |
| GET  | `/api/questions?lang=fr&ax=0` | list filtered |
| GET  | `/api/questions/random?count=20&lang=ar` | random selection |
| POST | `/api/attempts/start` | `{ sessionId, mode, count, lang }` |
| POST | `/api/attempts/:id/submit` | `{ sessionId, answers }` |
| GET  | `/api/attempts/by-session/:sessionId` | history |
| GET  | `/api/attempts/:id?sessionId=...` | attempt + correction |
| *    | `/api/admin/**` | requires header `X-Admin-Key` |

## Project layout

```
backend/        Express + Mongoose API
frontend/       Vite + React + Tailwind SPA
legacy/         Original index.html (reference)
docs/           Specs and plans
```

## Available scripts (root)

- `npm run dev` — backend + frontend in parallel
- `npm run dev:back` / `npm run dev:front` — one side only
- `npm run seed` — re-seed MongoDB
- `npm run extract` — re-extract data from legacy HTML

## Languages

- **Arabic** (default, RTL) — fully populated
- **French / English** — UI translated; question content is filled via the admin → **Translations** page

## v2 ideas (not in scope)

- User accounts (signup / login)
- Real auth instead of static `X-Admin-Key`
- PWA / offline mode
- PDF export of corrections
