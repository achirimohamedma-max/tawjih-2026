# Spec — Refactor fullstack de Tawjih 2026

**Date** : 2026-05-11
**Auteur** : Houssam (avec Claude)
**Statut** : En attente de validation
**Source** : `index.html` (2 511 lignes, SPA monolithique)

---

## 1. Objectif

Transformer l'application monolithique `index.html` (منصة التوجيه التربوي 2026) en projet fullstack moderne :

- **Backend** Node.js + Express + MongoDB (Mongoose)
- **Frontend** React (Vite) + Tailwind CSS + React Router + Zustand + React Query + i18next
- **Internationalisation** arabe (défaut, RTL) / français / anglais
- **Interface admin** pour CRUD sur les questions et stats d'utilisation
- **Pas d'authentification utilisateur** en v1 (identification par `sessionId` localStorage anonyme)
- Admin protégé par clé statique `X-Admin-Key` (auth réelle à ajouter en v2)

L'app conserve la totalité des fonctionnalités existantes : 6 écrans (landing, dashboard, résumés théoriques 3 niveaux, examens QCM/psy, correction détaillée).

---

## 2. Stack technique

### Backend (`/backend`)
- Node.js 18+ / Express
- MongoDB + Mongoose
- `bcrypt` (préparé pour v2 auth)
- `jsonwebtoken` (préparé pour v2 auth)
- `express-validator`, `cors`, `morgan`, `dotenv`
- Tests : Vitest + supertest

### Frontend (`/frontend`)
- Vite + React 18
- Tailwind CSS + plugin `tailwindcss-rtl`
- React Router v6
- Zustand (state global UI + examen)
- TanStack Query (data fetching)
- Axios
- `react-i18next` + `i18next-browser-languagedetector`
- Tests : Vitest + React Testing Library

### Repo
Monorepo simple, deux `package.json` distincts (`backend/`, `frontend/`), un `package.json` racine léger pour `concurrently`.

---

## 3. Architecture des dossiers

```
tawjih-2026/
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── models/
│   │   │   ├── Question.js
│   │   │   └── Attempt.js
│   │   ├── controllers/
│   │   ├── routes/
│   │   │   ├── questions.routes.js
│   │   │   ├── attempts.routes.js
│   │   │   └── admin.routes.js
│   │   ├── middleware/
│   │   │   ├── adminKey.js
│   │   │   ├── validate.js
│   │   │   └── errorHandler.js
│   │   ├── utils/pickLang.js
│   │   ├── data/questions.seed.json
│   │   └── app.js
│   ├── scripts/
│   │   ├── extract-questions.js   (one-shot)
│   │   ├── extract-theory.js      (one-shot)
│   │   └── seed.js
│   ├── tests/
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/                   (axios + endpoints)
│   │   ├── components/            (Button, Card, ProgressRing, QuestionCard, etc.)
│   │   ├── layouts/               (PublicLayout, AdminLayout)
│   │   ├── pages/
│   │   ├── store/                 (uiStore, examStore, sessionStore)
│   │   ├── hooks/
│   │   ├── locales/
│   │   │   ├── ar/{common,theory}.json
│   │   │   ├── fr/{common,theory}.json
│   │   │   └── en/{common,theory}.json
│   │   ├── data/summary-structure.js
│   │   ├── styles/index.css
│   │   ├── i18n.js
│   │   └── App.jsx
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── .env.example
│   └── package.json
│
├── legacy/index.html              (référence)
├── docs/superpowers/specs/
├── ANALYSE.md
├── README.md
└── package.json                   (racine, concurrently)
```

---

## 4. Modèles MongoDB

### 4.1 `Question`

```js
{
  _id: ObjectId,
  legacyId: Number,                       // 1..60, unique, pour migrations
  ax: Number,                              // 0..3 (axe)
  sub: String,                             // "1.1", "2.3"...
  diff: 'سهل' | 'متوسط' | 'صعب',
  src: String,
  cor: Number,                             // 0..3
  isActive: Boolean (default true),

  // Champs multilingues
  text: { ar: String, fr: String|null, en: String|null },
  ch:   { ar: [String], fr: [String]|null, en: [String]|null },
  exp:  { ar: String, fr: String|null, en: String|null },
  subN: { ar: String, fr: String|null, en: String|null },

  // Optionnel — exercices psychotechniques
  type: String|null,                       // 'psy', etc.
  series: [Mixed]|null,                    // séries numériques
  grid: [[Mixed]]|null,                    // grilles logiques
  cat: String|null,                        // catégorie psy

  createdAt: Date, updatedAt: Date
}
```

**Indexes** : `{ legacyId: 1 }` unique, `{ ax: 1, sub: 1 }`, `{ isActive: 1 }`.

### 4.2 `Attempt`

```js
{
  _id: ObjectId,
  sessionId: String,                       // UUID v4 généré côté client
  mode: 'qcm' | 'psy' | 'mixed',
  lang: 'ar' | 'fr' | 'en',                // langue de l'examen
  questionIds: [ObjectId],
  answers: [Number | null],                // réponse user pour chaque question
  score: Number,                            // /20
  correct: Number,
  wrong: Number,
  empty: Number,
  durationMin: Number,
  axisBreakdown: [{
    sub: String, subN: String, ax: Number,
    correct: Number, total: Number
  }],
  startedAt: Date,
  finishedAt: Date|null                     // null tant que non soumis
}
```

**Index** : `{ sessionId: 1, finishedAt: -1 }`.

---

## 5. API REST

Base : `/api`. Réponses JSON. Erreurs uniformes `{ error: { code, message } }`.
Langue : query param `?lang=ar|fr|en` (défaut `ar`).

### 5.1 Public — Questions

| Méthode | Route | Description |
|---|---|---|
| GET | `/questions?ax=&sub=&diff=&type=&lang=` | Liste filtrable |
| GET | `/questions/random?count=20&ax=&type=&lang=` | Tire N questions aléatoires |
| GET | `/questions/:id?lang=` | Détail (sans `cor`) |

### 5.2 Public — Attempts (identifiés par `sessionId`)

| Méthode | Route | Description |
|---|---|---|
| POST | `/attempts/start` | Body `{ sessionId, mode, count, ax?, lang }` → crée Attempt + renvoie questions (sans `cor`/`exp`) |
| POST | `/attempts/:id/submit` | Body `{ sessionId, answers }` → calcule score, sauvegarde, renvoie correction complète |
| GET | `/attempts/by-session/:sessionId?page=&limit=` | Historique session |
| GET | `/attempts/:id?sessionId=` | Détail tentative + correction |

### 5.3 Admin — protégé par header `X-Admin-Key`

| Méthode | Route | Description |
|---|---|---|
| GET | `/admin/questions?page=&search=&missingLang=` | Liste complète paginée |
| POST | `/admin/questions` | Crée question (champs multilingues) |
| PATCH | `/admin/questions/:id` | Update |
| DELETE | `/admin/questions/:id` | Soft delete (`isActive=false`) |
| POST | `/admin/questions/:id/translate` | `{ lang, text, ch, exp, subN }` |
| POST | `/admin/questions/bulk-import` | Import JSON masse |

### 5.4 Admin — Stats

| Méthode | Route | Description |
|---|---|---|
| GET | `/admin/stats/overview` | `{ attemptsCount, avgScore, todayAttempts, totalQuestions, langCoverage }` |
| GET | `/admin/stats/questions` | Taux de réussite par question |
| GET | `/admin/stats/axes` | Performance moyenne par axe / sous-thème |
| GET | `/admin/stats/activity?days=30` | Tentatives par jour |

### 5.5 Helper de langue

```js
function pickLang(question, lang) {
  return {
    ...question.toObject(),
    text: question.text[lang] || question.text.ar,
    ch:   question.ch[lang]   || question.ch.ar,
    exp:  question.exp[lang]  || question.exp.ar,
    subN: question.subN[lang] || question.subN.ar,
  };
}
```

---

## 6. Frontend

### 6.1 Routing

```
/                              LandingPage
/dashboard                     DashboardPage
/summary                       SummaryPage (3 niveaux internes)
/exam/qcm                      QcmExamPage
/exam/psy                      PsyExamPage
/exam/:attemptId/result        CorrectionPage
/history                       HistoryPage
/admin                         AdminLayout (protégé)
  ├── /admin/questions         QuestionListPage
  ├── /admin/translations      TranslationsPage
  └── /admin/stats             StatsPage
*                              NotFoundPage
```

### 6.2 Stores Zustand

```js
// uiStore : { lang, dir, setLang }
// examStore : { attemptId, questions, currentIndex, answers, startTime, setAnswer, next, prev, reset }
// sessionStore : { sessionId } (UUID persisté localStorage)
```

### 6.3 i18n

- `react-i18next` avec ressources `ar/fr/en`
- Détecteur : `localStorage > navigator > 'ar'`
- `<html lang dir>` mis à jour dynamiquement par `uiStore`
- Plugin Tailwind `tailwindcss-rtl` pour utilitaires `rtl:`/`ltr:`
- Textes des questions : envoyés par l'API selon `?lang=`, donc résolus serveur
- Textes UI (boutons, titres) : dans `frontend/src/locales/`
- Textes théoriques (cartes Summary) : dans `frontend/src/locales/{lang}/theory.json`

### 6.4 Thème Tailwind

Couleurs du drapeau marocain et palette existante :

```js
colors: {
  red: { DEFAULT: '#C1272D', dark: '#8B1A1E' },
  green: { DEFAULT: '#006233', dark: '#004d26' },
  gold: { DEFAULT: '#C8A84B', light: '#F5DC80' },
  cream: '#FAF8F3', surf: '#F4F0E8', bord: '#E2D9C8', ink: '#1A1A2E',
}
```

Fonts : `Tajawal`/`Cairo` pour arabe, `Inter` pour latin, `Roboto Mono` pour mono.

### 6.5 Identification session

- À l'initialisation : `localStorage.getItem('tawjih_session') || crypto.randomUUID()` → persiste
- Préférence langue : `localStorage.getItem('tawjih_lang')`
- Préparation v2 auth : à l'inscription, on enverra le `sessionId` actuel pour migrer les attempts vers le nouveau user.

---

## 7. Migration des données

### 7.1 Script `extract-questions.js` (one-shot)

1. Lit `legacy/index.html` (anciennement `index.html` racine)
2. Repère le bloc `const QDB=[...]` via regex sur les marqueurs
3. Évalue le tableau dans un sandbox Node (`vm.runInNewContext`)
4. Transforme chaque entrée vers le schéma Mongo avec champs multilingues (`ar` rempli, `fr`/`en` à `null`)
5. Écrit `backend/src/data/questions.seed.json` (commité)

### 7.2 Script `seed.js`

```bash
npm run seed          # insère sans toucher l'existant
npm run seed -- --reset   # supprime puis insère
```

### 7.3 Script `extract-theory.js` (one-shot)

Extrait `CARDS_HTML` + `SUM_STRUCTURE` et produit :
- `frontend/src/data/summary-structure.js`
- `frontend/src/locales/ar/theory.json` (rempli)
- `frontend/src/locales/{fr,en}/theory.json` (stubs)

Les cartes théoriques restent côté frontend (composants React), pas en BDD.

---

## 8. Plan de construction (phases)

1. **Scaffold** monorepo + dépendances backend + frontend
2. **Backend** : models, connexion DB, app.js de base
3. **Scripts d'extraction** + génération du seed JSON + commit
4. **Backend routes publiques** (`/questions`, `/attempts`) + tests
5. **Frontend scaffold** : Vite, Tailwind, i18next, Router, Zustand, React Query, layouts
6. **Frontend pages publiques** : Landing, Dashboard, Summary, QCM, Psy, Correction, History
7. **Backend routes admin** + middleware `adminKey`
8. **Frontend admin** : liste, édition multilingue, stats (Recharts)
9. **Polish** : loaders, erreurs, responsive, RTL/LTR, README

---

## 9. Configuration

### `backend/.env.example`
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/tawjih2026
ADMIN_KEY=change-me-in-prod
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### `frontend/.env.example`
```
VITE_API_URL=http://localhost:5000/api
```

### `package.json` racine
```json
{
  "scripts": {
    "dev": "concurrently \"npm:dev:back\" \"npm:dev:front\"",
    "dev:back": "npm --prefix backend run dev",
    "dev:front": "npm --prefix frontend run dev",
    "seed": "npm --prefix backend run seed"
  }
}
```

---

## 10. Tests (v1 légers)

- **Backend** : intégration Vitest + supertest sur `random`, `start`, `submit`, admin CRUD
- **Frontend** : Vitest + RTL sur `QuestionCard`, `CorrectionItem`, `ProgressRing`
- Pas d'objectif de couverture en v1, focus sur les chemins métier

---

## 11. Risques et mitigations

| Risque | Mitigation |
|---|---|
| Extraction `QDB` cassée si syntaxe change | One-shot, JSON commité, plus de dépendance après |
| Admin sans auth en prod | `ADMIN_KEY` fort en env + remplacé par auth réelle en v2 |
| RTL/LTR mélangés (questions arabes dans UI française) | `tailwindcss-rtl` + override `dir="rtl"` sur composants question quand `lang=ar` |
| Performance liste 60 questions | Négligeable, indexation Mongo suffisante |
| `legacyId` pour migrations futures | Conservé unique |

---

## 12. Hors scope v1 (préparé v2)

- Authentification utilisateur (signup/signin) — sera ajoutée plus tard
- Profils, classements, leaderboard
- Export PDF des corrections
- Notifications, emails
- PWA / offline (déploiement statique possible plus tard)
- Vrais analytics utilisateur (Plausible/PostHog)
