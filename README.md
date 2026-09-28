# 🌸 Bloom — Floral To-Do & Notes

> A serene, modern To-Do & Notes sanctuary with Apple-inspired minimalist design, organic botanical animations, real-time Firestore database, and two distinct experience modes: **Simple** & **Magic**.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fiamadoctorforreal%2FHNG15-Stage-0-ToDo-List)

---

## ✨ Features

### 🌸 Botanical Aesthetics (No Generic AI Purple/Black)
- **Handcrafted SVG Botanicals**: Lavender sprigs, blossoming roses, and daffodils with stems floating in the background.
- **Fluid Floating Motion**: Subtle, natural drift using gentle keyframe physics.
- **Interactive Ripple & Rustle**: Hovering over flowers creates an expanding ripple wave and an organic foliage rustle sound effect.
- **Dual Themes**:
  - **Light Theme**: Warm cream, soft rose, beige, and lavender.
  - **Dark Theme**: Deep plum, midnight violet, and muted botanical silhouettes.

### 🌓 Two Distinct Experience Modes
1. **Simple Mode**:
   - Apple Reminders meets floral elegance.
   - Todo checklist with circular botanical checkboxes.
   - Expandable rich notes for journaling, links, and detailed thoughts.
   - Filter by status (*All*, *Active*, *Done*) and by flower motif (*Roses*, *Lavender*, *Daffodils*).
   - Real-time search across titles and notes.
   - Confetti petal celebration upon task completion!

2. **Magic Mode** ✨:
   - Full-screen swipeable card deck with 3D depth and subtle glassmorphic blur.
   - Swipe **Left / Right** to navigate between cards with silky whoosh sounds.
   - Swipe **Up** to mark cards as complete with petal bursts.
   - Custom botanical watermark and typography on every card.

### 🔊 Apple-Clean Sound Effects (Web Audio API)
- Soft leaf rustle on flower hover
- Clean haptic click on interactions
- Silky whoosh on card swipe
- Harmonic chime chord on task completion
- Soft pop on task deletion
- Sound toggle button to mute/unmute at any time

### ⚡ Full-Stack Architecture
- **Frontend**: React 18 + Vite + Tailwind CSS + Framer Motion + Canvas Confetti + Lucide Icons
- **Backend**: FastAPI (Python) serverless functions
- **Database**: Google Firebase Firestore (real-time NoSQL persistence)
- **Deployment**: Unified Vercel serverless deployment (`vercel.json`)

---

## 🚀 Environment Variables Setup

### 1. Local Development (`.env`)
In the root directory, create a `.env` file (already configured in `.gitignore` so your secrets stay safe):

```env
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="your-service-account-email"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 2. Vercel Production Deployment
When importing your repository in Vercel:
1. Go to **Project Settings** > **Environment Variables**
2. Add the following 3 variables:
   - `FIREBASE_PROJECT_ID` = `hng15-stage-0`
   - `FIREBASE_CLIENT_EMAIL` = `firebase-adminsdk-fbsvc@hng15-stage-0.iam.gserviceaccount.com`
   - `FIREBASE_PRIVATE_KEY` = your full private key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`

---

## 🛠️ Local Development

### 1. Install Dependencies
```bash
# Frontend
npm install

# Backend
python -m pip install -r api/requirements.txt
```

### 2. Start Backend & Frontend
```bash
# Run FastAPI Backend (Terminal 1)
uvicorn api.index:app --reload --port 8000

# Run Vite Frontend (Terminal 2)
npm run dev
```

Visit `http://localhost:5173` to explore Bloom!

---

## 📦 Project Structure

```
├── api/
│   ├── index.py              # FastAPI application & Firestore client
│   └── requirements.txt      # Python dependencies (fastapi, firebase-admin, etc.)
├── src/
│   ├── components/
│   │   ├── Flowers/
│   │   │   ├── BotanicalSVGs.jsx       # Handcrafted SVG flowers
│   │   │   └── FloatingBotanicals.jsx  # Floating animation & ripple hover
│   │   ├── Layout/
│   │   │   └── Navbar.jsx              # Apple-style glassmorphic header
│   │   ├── Magic/
│   │   │   └── MagicMode.jsx           # Swipeable card deck & gestures
│   │   ├── Modals/
│   │   │   └── TodoModal.jsx           # Plant task & notes modal
│   │   └── Simple/
│   │       └── SimpleMode.jsx          # List view with expandable notes
│   ├── context/
│   │   └── ThemeContext.jsx            # Light/Dark theme & sound state
│   ├── utils/
│   │   ├── api.js                      # REST API client
│   │   └── soundEffects.js             # Web Audio API sound synthesizer
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── vercel.json               # Vercel configuration for FastAPI + React
├── package.json
└── vite.config.js
```

---

## 📜 License
MIT © [iamadoctorforreal](https://github.com/iamadoctorforreal)
