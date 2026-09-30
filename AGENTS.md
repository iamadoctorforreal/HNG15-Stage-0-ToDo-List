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
