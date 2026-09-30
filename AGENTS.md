# AGENTS.md — Development Guidelines for AI Agents

Welcome to **Bloom by HERSPEW** (HNG 15 Stage 0). This document establishes the core operating rules, architectural standards, and mandatory validation requirements for all AI agents contributing to this codebase.

---

## 🚨 Mandatory Agent Directive: Endpoint Testing & Validation

> ### **CRITICAL REQUIREMENT**
> **Every AI agent MUST write automated tests for ALL endpoints that are created or modified, and ALWAYS validate that these endpoints are working properly before completing any task.**
>
> 1. When creating a new endpoint or updating an existing route in `api/index.py`, add corresponding test cases in `tests/test_api.py`.
> 2. Execute the test suite and confirm that all tests pass:
>    ```bash
>    python -m unittest tests/test_api.py
>    ```
> 3. Verify HTTP status codes (`200 OK`, `201 Created`, `404 Not Found`), payload structures, multi-user isolation, and error handling.
> 4. Do not submit or push changes without validating that the test suite passes with zero errors.

---

## 🌸 Project Overview & Identity

* **Application**: Bloom by HERSPEW
* **Repository**: `https://github.com/iamadoctorforreal/HNG15-Stage-0-ToDo-List.git`
* **Live Deployment**: `https://hng-15-stage-0-to-do-list-w5fc.vercel.app`
* **Aesthetic**: Apple-clean minimalism, calm floral themes (Rose/Pink, Lavender/Purple, Daffodil/Amber), serene typography, and dark/light mode toggle.
* **Core Tenets**:
  * No generic dark/neon cliché AI palettes.
  * Living floating SVG botanicals with natural rustle audio on click and hover.
  * Tactile sound effects powered by zero-dependency Web Audio API.
  * Browser-native zero-weight Voice-to-Text dictation.

---

## 🏛️ System Architecture

### 1. Backend (`api/index.py`)
* **Framework**: FastAPI (Python 3.10+) running serverless on Vercel.
* **Database**: Google Firebase Firestore (`hng15-stage-0`).
* **Multi-User Data Isolation**:
  * Data is isolated per user using Firestore scoped subcollections:
    * `/users/{user_id}/todos/{todo_id}`
    * `/users/{user_id}/notebooks/{notebook_id}`
    * `/users/{user_id}/notes/{note_id}`
  * The `user_id` is supplied via query parameter (`?user_id=...`) and HTTP header (`X-User-Id`).
  * **Demo Profile (`demo` / `demo@bloom.app`)**: Seeded with 4 full starter tasks, 3 themed notebooks, and journal reflections.
  * **New User Profiles**: Seeded with **exactly one** starter task and **one** starter notebook to prevent clutter.
  * Modifications or deletions in User A's profile must **never** affect User B or the Demo profile.

### 2. Frontend (`src/`)
* **Framework**: React 18 + Vite + Tailwind CSS + Framer Motion.
* **Modes**:
  1. `Simple`: Clean list, expandable rich notes, filtering (All, Active, Completed, Flower motifs), search, and petal confetti celebration on completion.
  2. `Magic`: 3D card deck with visual stacking, swipe gestures, and tactile card whoosh audio.
  3. `Calendar`: Completion rate ring, task breakdown charts, and monthly calendar view.
  4. `Journal`: Named sanctuary notebooks, 14-day writing activity heatmap, gentle absence alert, and voice-to-text dictation.
* **Zero-Weight Voice Dictation (`src/utils/speechToText.js`)**:
  * Utilizes HTML5 Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`).
  * 0 KB added external bundle size.

---

## 🧪 Testing & Validation Suite

Automated tests are located in `tests/test_api.py` and run using Python's built-in `unittest` runner.

### Running Backend Tests
```bash
python -m unittest tests/test_api.py
```

### Coverage Checklist for Endpoints:
- [x] **Health Check**: `GET /api/health`
- [x] **Todos CRUD**:
  - `GET /api/todos` (validates multi-user seeding and isolation)
  - `POST /api/todos` (validates creation)
  - `GET /api/todos/{id}` (validates retrieval)
  - `PATCH /api/todos/{id}/toggle` (validates completion toggle)
  - `PUT /api/todos/{id}` (validates updates)
  - `DELETE /api/todos/{id}` (validates deletion and isolation)
- [x] **Notebooks CRUD**:
  - `GET /api/notebooks` (validates pre-seeded notebooks and note counts)
  - `POST /api/notebooks` (validates notebook creation)
  - `DELETE /api/notebooks/{id}` (validates notebook and child notes deletion)
- [x] **Notes CRUD**:
  - `GET /api/notes` (validates retrieval and notebook filtering)
  - `POST /api/notes` (validates creation and word count calculation)
  - `GET /api/notes/{id}` (validates single note retrieval)
  - `PUT /api/notes/{id}` (validates content updates and word count recalculation)
  - `DELETE /api/notes/{id}` (validates note deletion)

### Validating Frontend Builds
Before pushing changes, always run a production bundle build:
```bash
npx vite build
```

---

## 📋 Guidelines for Future Agent Contributions

1. **Test-First Endpoint Development**: Write tests for all endpoints you create. Always validate that they pass before completing a task.
2. **Preserve User Data Isolation**: Never create flat collections where user data mixes. Always scope documents under `/users/{user_id}/`.
3. **Resilient UI State**: Optimistic UI updates should not violently revert if there is minor network latency. Handle fallbacks gracefully.
4. **Lightweight Principles**: Prefer native web APIs (Web Audio API, Web Speech API, CSS variables) over heavy third-party npm packages.
5. **Brand Integrity**: Maintain "Bloom by HERSPEW" branding and avoid using forbidden terminology (e.g. do not label sections "botanical").

---

## 🛠️ Environment Setup

### Prerequisites
* Python 3.10+
* Node.js 18+ (avoid v24 on Windows — see Known Pitfalls)
* npm or yarn

### Backend Dependencies
```bash
pip install fastapi firebase-admin python-dotenv uvicorn httpx
```

### Frontend Dependencies
```bash
npm install
```

### Required `.env` File (project root)
Create a `.env` file at the repository root with the following variables:
```env
FIREBASE_PROJECT_ID=hng15-stage-0
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@hng15-stage-0.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----\n"
```
> ⚠️ The `FIREBASE_PRIVATE_KEY` must be wrapped in double quotes and use literal `\n` for newlines. The backend handles unescaping automatically.

### Running Locally
```bash
# Backend (serves API + built frontend from dist/)
python -m uvicorn api.index:app --reload --port 8000

# Frontend dev build (generate dist/ for the backend to serve)
npx vite build
```

---

## 🚀 Deployment Workflow

### Active Vercel Project
* **Live URL**: `https://hng-15-stage-0-to-do-list-w5fc.vercel.app`
* This is the **only** active deployment. An older project at `hng-15-stage-0-to-do-list.vercel.app` is defunct — ignore it.

### Vercel Environment Variables
The following **must** be set in the Vercel project's Environment Variables settings (Settings → Environment Variables):
| Variable | Value |
|----------|-------|
| `FIREBASE_PROJECT_ID` | `hng15-stage-0` |
| `FIREBASE_CLIENT_EMAIL` | `firebase-adminsdk-fbsvc@hng15-stage-0.iam.gserviceaccount.com` |
| `FIREBASE_PRIVATE_KEY` | Full RSA private key (with real newlines or `\n` escapes) |

### How Deploys Work
1. Push to the `main` branch on GitHub.
2. Vercel auto-detects the push and redeploys.
3. After deploy, do a **hard refresh** (`Ctrl+Shift+R`) in the browser — Vercel's static cache can serve stale frontend bundles.

### Vercel Project Structure
* `vercel.json` routes all `/api/*` requests to the FastAPI serverless function at `api/index.py`.
* The frontend is built by Vite into `dist/` and served as static files.
* The SPA catch-all route in `api/index.py` (`/{full_path:path}`) **must remain at the very bottom** of the file or it will intercept API routes.

---

## 📝 Git Conventions

### Commit Messages
Use clear, descriptive commit messages. Prefix with a category when possible:
* `feat:` — New feature (e.g. `feat: add Journal mode with notebooks and notes`)
* `fix:` — Bug fix (e.g. `fix: task completion strikethrough no longer reverts on network error`)
* `test:` — Adding or updating tests (e.g. `test: add notebook CRUD endpoint tests`)
* `docs:` — Documentation changes (e.g. `docs: update AGENTS.md with deployment workflow`)
* `chore:` — Maintenance tasks (e.g. `chore: clean up unused imports`)

### Pushing to GitHub
```bash
git add -A
git commit -m "feat: descriptive message here"
git push origin main
```
> ⚠️ See **Known Pitfalls** below before pushing — certain git configs can cause fatal errors.

---

## 🗄️ Firestore Data Model

All user data is scoped under per-user subcollections. **Never** create top-level flat collections.

```
firestore-root/
└── users/
    ├── demo/                          ← Demo profile (auto-seeded with rich data)
    │   ├── todos/
    │   │   ├── {todo_id}              ← { title, note, flower, priority, completed, created_at, updated_at }
    │   │   └── ...
    │   ├── notebooks/
    │   │   ├── {notebook_id}          ← { name, emoji, created_at }
    │   │   └── ...
    │   └── notes/
    │       ├── {note_id}              ← { notebook_id, title, content, word_count, created_at, updated_at }
    │       └── ...
    │
    ├── user@example.com/              ← Real user (auto-seeded with 1 task + 1 notebook)
    │   ├── todos/
    │   ├── notebooks/
    │   └── notes/
    │
    └── another@user.com/              ← Each user is fully isolated
        ├── todos/
        ├── notebooks/
        └── notes/
```

### User ID Resolution
* `demo@bloom.app` or users with `isDemo: true` → `"demo"`
* All other users → `user.email.trim().toLowerCase()`
* Backend sanitizes IDs: `re.sub(r'[^a-z0-9_\-\.@]', '_', user_id)`

---

## ⚠️ Known Pitfalls & Forbidden Patterns

### 1. Git `http.postBuffer` Causes Out-of-Memory Crashes
Setting `git config --global http.postBuffer 524288000` (500 MB) causes fatal "Out of memory" errors on push. **Always unset it before pushing:**
```bash
git config --global --unset http.postBuffer
```

### 2. SPA Catch-All Route Must Stay at the Bottom
The `/{full_path:path}` route in `api/index.py` serves the frontend SPA. If it is placed above API routes, it will intercept `/api/*` requests and return HTML instead of JSON. **Always keep it as the very last route.**

### 3. Node.js v24 + Windows + Spaces in Path
Node.js v24 on Windows crashes esbuild during `vite dev` when the project path contains spaces (e.g. `HNG 15 Stage 0`). Workaround: use `python -m uvicorn` to serve the pre-built `dist/` instead of running `vite dev`.

### 4. Vercel Static Cache
After deploying, the browser may serve a cached version of the old frontend. Always do a hard refresh (`Ctrl+Shift+R`) after a new deploy to see changes.

### 5. Python `datetime.utcnow()` Deprecation
Python 3.12+ shows deprecation warnings for `datetime.datetime.utcnow()`. These are cosmetic and do not affect functionality, but new code should prefer `datetime.datetime.now(datetime.timezone.utc)` when possible.

### 6. Never Use the Word "Botanical"
The creator (HERSPEW) explicitly forbade using the word "botanical" in the UI. Use "floral", "garden", or "bloom" language instead.

