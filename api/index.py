import os
import re
import datetime
from typing import Optional, List
from pathlib import Path
from fastapi import FastAPI, HTTPException, status, Query, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv

# Load .env file from root directory if available
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

# Initialize Firebase Admin
def get_firestore_client():
    if not firebase_admin._apps:
        project_id = os.getenv("FIREBASE_PROJECT_ID")
        client_email = os.getenv("FIREBASE_CLIENT_EMAIL")
        private_key = os.getenv("FIREBASE_PRIVATE_KEY")

        if not all([project_id, client_email, private_key]):
            raise RuntimeError(
                "Missing Firebase credentials. Please verify FIREBASE_PROJECT_ID, "
                "FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in .env or Vercel environment variables."
            )

        # Handle escaped newlines in private key
        formatted_private_key = private_key.replace("\\n", "\n")

        cred_dict = {
            "type": "service_account",
            "project_id": project_id,
            "private_key": formatted_private_key,
            "client_email": client_email,
            "token_uri": "https://oauth2.googleapis.com/token",
        }

        cred = credentials.Certificate(cred_dict)
        firebase_admin.initialize_app(cred)

    return firestore.client()

app = FastAPI(
    title="Bloom Floral To-Do & Notes API",
    description="Full-stack FastAPI backend powered by Firebase Firestore with per-user data isolation",
    version="1.0.0"
)

# Enable CORS for local dev and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Models
class TodoCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    note: Optional[str] = Field(default="")
    flower: Optional[str] = Field(default="lavender") # lavender, rose, daffodil
    priority: Optional[str] = Field(default="medium") # low, medium, high
    completed: Optional[bool] = False

class TodoUpdate(BaseModel):
    title: Optional[str] = None
    note: Optional[str] = None
    flower: Optional[str] = None
    priority: Optional[str] = None
    completed: Optional[bool] = None

class TodoResponse(BaseModel):
    id: str
    title: str
    note: str = ""
    flower: str = "lavender"
    priority: str = "medium"
    completed: bool = False
    created_at: str
    updated_at: str

# Pydantic Models for Notebooks & Notes
class NotebookCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=120)
    flower: Optional[str] = "rose"
    icon: Optional[str] = "🌸"
    description: Optional[str] = ""

class NotebookResponse(BaseModel):
    id: str
    title: str
    flower: str = "rose"
    icon: str = "🌸"
    description: str = ""
    note_count: int = 0
    created_at: str

class NoteCreate(BaseModel):
    notebook_id: str
    title: str = Field(..., min_length=1, max_length=200)
    content: Optional[str] = ""
    flower: Optional[str] = "rose"
    mood: Optional[str] = "calm"

class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    flower: Optional[str] = None
    notebook_id: Optional[str] = None
    mood: Optional[str] = None

class NoteResponse(BaseModel):
    id: str
    notebook_id: str
    title: str
    content: str = ""
    flower: str = "rose"
    mood: str = "calm"
    word_count: int = 0
    created_at: str
    updated_at: str

# Pre-populated seed data
DEMO_SEED_NOTEBOOKS = [
    {
        "id": "demo-nb-1",
        "title": "Morning Reflections",
        "flower": "rose",
        "icon": "🌸",
        "description": "Peaceful morning intentions, grounding rituals & gratitude",
    },
    {
        "id": "demo-nb-2",
        "title": "Daily Gratitude & Calm",
        "flower": "lavender",
        "icon": "🪻",
        "description": "Tracking daily little joys and moments of serenity",
    },
    {
        "id": "demo-nb-3",
        "title": "Creative Seeds & Ideas",
        "flower": "daffodil",
        "icon": "🌼",
        "description": "Brainstorms, new thoughts, and inspirations",
    }
]

DEMO_SEED_NOTES = [
    {
        "notebook_id": "demo-nb-1",
        "title": "Sunrise & Stillness in the Sanctuary",
        "content": "Today the dawn light crept through the window in soft amber hues. Drinking warm herbal tea while listening to the birds in the garden. Today's intention is simple: move with calm focus, finish HNG Stage 0 with excellence, and nourish the spirit without rushing.",
        "flower": "rose",
        "mood": "calm",
        "word_count": 48
    },
    {
        "notebook_id": "demo-nb-2",
        "title": "Three Little Joys of the Day",
        "content": "1. The sweet fragrance of blooming lavender after dawn rain.\n2. The crisp tactile feeling of smooth card swipes in Magic Mode.\n3. Making steady progress and finding joy in deliberate, thoughtful craftsmanship.",
        "flower": "lavender",
        "mood": "grateful",
        "word_count": 36
    },
    {
        "notebook_id": "demo-nb-3",
        "title": "Voice Journaling & Peaceful Software",
        "content": "What if our digital tools felt like walking through a sunlit conservatory instead of a stressful inbox? Adding voice dictation lets thoughts flow without the tension of a keyboard.",
        "flower": "daffodil",
        "mood": "inspired",
        "word_count": 30
    }
]

NEW_USER_SEED_NOTEBOOK = {
    "title": "My Sanctuary Journal",
    "flower": "rose",
    "icon": "🌸",
    "description": "Your personal haven for notes and reflections",
}

NEW_USER_SEED_NOTE = {
    "title": "Welcome to your Journal 🌸",
    "content": "Welcome to your sacred writing space. You can organize your thoughts across notebooks, check your writing streak in the activity graph above, or tap the microphone button to dictate thoughts effortlessly using browser voice-to-text. Breathe deeply and bloom.",
    "flower": "rose",
    "mood": "calm",
    "word_count": 42
}
DEMO_SEED_ITEMS = [
    {
        "title": "Buy from Temu",
        "note": "I just need to order already",
        "flower": "rose",
        "priority": "high",
        "completed": False,
    },
    {
        "title": "Review HNG 15 Stage 0 submission criteria 🌸",
        "note": "Verify live Vercel URL, GitHub repository, clean Apple aesthetics, and responsive layout.",
        "flower": "rose",
        "priority": "high",
        "completed": True,
    },
    {
        "title": "Pick fresh lavender from the morning garden 🪻",
        "note": "Place a small bundle on the nightstand for soothing lavender aroma and peaceful focus.",
        "flower": "lavender",
        "priority": "medium",
        "completed": False,
    },
    {
        "title": "Hydrate and stretch in the warm sunlight 🌼",
        "note": "Step away from the screen for 10 minutes of deep breathing and sunshine.",
        "flower": "daffodil",
        "priority": "low",
        "completed": True,
    }
]

NEW_USER_SEED_ITEM = {
    "title": "Welcome to your personal sanctuary 🌸",
    "note": "Tap here to view notes or mark as done. Switch between Simple and Magic modes above to experience Bloom!",
    "flower": "rose",
    "priority": "medium",
    "completed": False,
}

def get_user_todos_collection(user_id: Optional[str] = None):
    """
    Returns the isolated Firestore collection reference for this specific user.
    Path: users/{clean_id}/todos
    This ensures 100% data isolation: User A's todos are physically separated from User B's.
    """
    clean_id = (user_id or "demo").strip().lower()
    if not clean_id or clean_id == "demo@bloom.app":
        clean_id = "demo"
    # Sanitize document key: allow alphanumeric, hyphens, dots, underscores, @
    clean_id = re.sub(r'[^a-z0-9_\-\.@]', '_', clean_id)
    db = get_firestore_client()
    return db.collection("users").document(clean_id).collection("todos"), clean_id

def get_user_notebooks_collection(user_id: Optional[str] = None):
    clean_id = (user_id or "demo").strip().lower()
    if not clean_id or clean_id == "demo@bloom.app":
        clean_id = "demo"
    clean_id = re.sub(r'[^a-z0-9_\-\.@]', '_', clean_id)
    db = get_firestore_client()
    return db.collection("users").document(clean_id).collection("notebooks"), clean_id

def get_user_notes_collection(user_id: Optional[str] = None):
    clean_id = (user_id or "demo").strip().lower()
    if not clean_id or clean_id == "demo@bloom.app":
        clean_id = "demo"
    clean_id = re.sub(r'[^a-z0-9_\-\.@]', '_', clean_id)
    db = get_firestore_client()
    return db.collection("users").document(clean_id).collection("notes"), clean_id

# Serve built frontend from dist if present (unified local development)
dist_path = Path(__file__).resolve().parent.parent / "dist"

@app.get("/api/health")
@app.get("/health")
def health_check():
    try:
        db = get_firestore_client()
        return {
            "status": "healthy",
            "database": "firebase_firestore_connected",
            "project_id": os.getenv("FIREBASE_PROJECT_ID"),
            "isolation": "per_user_subcollections",
            "timestamp": datetime.datetime.utcnow().isoformat()
        }
    except Exception as e:
        return {
            "status": "degraded",
            "database_error": str(e),
            "timestamp": datetime.datetime.utcnow().isoformat()
        }

@app.get("/api/todos", response_model=List[TodoResponse])
@app.get("/todos", response_model=List[TodoResponse])
def get_todos(
    user_id: Optional[str] = Query(None),
    x_user_id: Optional[str] = Header(None, alias="X-User-Id")
):
    try:
        effective_user = user_id or x_user_id or "demo"
        todos_ref, clean_id = get_user_todos_collection(effective_user)
        docs = list(todos_ref.stream())

        # If user has no todos yet: auto-populate
        if len(docs) == 0:
            now = datetime.datetime.utcnow().isoformat()
            if clean_id == "demo":
                seed_items = DEMO_SEED_ITEMS
            else:
                # Any newly created profile starts with exactly ONE single sample to-do
                seed_items = [NEW_USER_SEED_ITEM]

            for item in seed_items:
                data = {
                    **item,
                    "created_at": now,
                    "updated_at": now,
                }
                todos_ref.add(data)

            # Re-fetch after seeding
            docs = list(todos_ref.stream())

        todo_list = []
        for doc in docs:
            data = doc.to_dict()
            todo_list.append({
                "id": doc.id,
                "title": data.get("title", ""),
                "note": data.get("note", ""),
                "flower": data.get("flower", "lavender"),
                "priority": data.get("priority", "medium"),
                "completed": data.get("completed", False),
                "created_at": data.get("created_at", datetime.datetime.utcnow().isoformat()),
                "updated_at": data.get("updated_at", datetime.datetime.utcnow().isoformat()),
            })

        # Sort by created_at descending
        todo_list.sort(key=lambda x: x.get("created_at", ""), reverse=True)
        return todo_list
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching todos from Firestore: {str(e)}"
        )

@app.post("/api/todos", response_model=TodoResponse, status_code=status.HTTP_201_CREATED)
def create_todo(
    todo: TodoCreate,
    user_id: Optional[str] = Query(None),
    x_user_id: Optional[str] = Header(None, alias="X-User-Id")
):
    try:
        effective_user = user_id or x_user_id or "demo"
        todos_ref, clean_id = get_user_todos_collection(effective_user)
        now = datetime.datetime.utcnow().isoformat()
        todo_data = {
            "title": todo.title.strip(),
            "note": (todo.note or "").strip(),
            "flower": todo.flower or "lavender",
            "priority": todo.priority or "medium",
            "completed": bool(todo.completed),
            "created_at": now,
            "updated_at": now,
        }

        update_time, doc_ref = todos_ref.add(todo_data)
        return {
            "id": doc_ref.id,
            **todo_data
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating todo: {str(e)}"
        )

@app.get("/api/todos/{todo_id}", response_model=TodoResponse)
def get_todo(
    todo_id: str,
    user_id: Optional[str] = Query(None),
    x_user_id: Optional[str] = Header(None, alias="X-User-Id")
):
    try:
        effective_user = user_id or x_user_id or "demo"
        todos_ref, clean_id = get_user_todos_collection(effective_user)
        doc = todos_ref.document(todo_id).get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Todo not found")
        data = doc.to_dict()
        return {
            "id": doc.id,
            "title": data.get("title", ""),
            "note": data.get("note", ""),
            "flower": data.get("flower", "lavender"),
            "priority": data.get("priority", "medium"),
            "completed": data.get("completed", False),
            "created_at": data.get("created_at", datetime.datetime.utcnow().isoformat()),
            "updated_at": data.get("updated_at", datetime.datetime.utcnow().isoformat()),
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving todo: {str(e)}"
        )

@app.put("/api/todos/{todo_id}", response_model=TodoResponse)
def update_todo(
    todo_id: str,
    updates: TodoUpdate,
    user_id: Optional[str] = Query(None),
    x_user_id: Optional[str] = Header(None, alias="X-User-Id")
):
    try:
        effective_user = user_id or x_user_id or "demo"
        todos_ref, clean_id = get_user_todos_collection(effective_user)
        doc_ref = todos_ref.document(todo_id)
        doc = doc_ref.get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Todo not found")

        current_data = doc.to_dict()
        update_dict = {}

        if updates.title is not None:
            update_dict["title"] = updates.title.strip()
        if updates.note is not None:
            update_dict["note"] = updates.note.strip()
        if updates.flower is not None:
            update_dict["flower"] = updates.flower
        if updates.priority is not None:
            update_dict["priority"] = updates.priority
        if updates.completed is not None:
            update_dict["completed"] = updates.completed

        update_dict["updated_at"] = datetime.datetime.utcnow().isoformat()
        doc_ref.update(update_dict)

        current_data.update(update_dict)
        return {
            "id": doc_ref.id,
            "title": current_data.get("title", ""),
            "note": current_data.get("note", ""),
            "flower": current_data.get("flower", "lavender"),
            "priority": current_data.get("priority", "medium"),
            "completed": current_data.get("completed", False),
            "created_at": current_data.get("created_at", ""),
            "updated_at": current_data.get("updated_at", ""),
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating todo: {str(e)}"
        )

@app.patch("/api/todos/{todo_id}/toggle", response_model=TodoResponse)
def toggle_todo(
    todo_id: str,
    user_id: Optional[str] = Query(None),
    x_user_id: Optional[str] = Header(None, alias="X-User-Id")
):
    try:
        effective_user = user_id or x_user_id or "demo"
        todos_ref, clean_id = get_user_todos_collection(effective_user)
        doc_ref = todos_ref.document(todo_id)
        doc = doc_ref.get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Todo not found")

        data = doc.to_dict()
        new_status = not data.get("completed", False)
        now = datetime.datetime.utcnow().isoformat()

        doc_ref.update({
            "completed": new_status,
            "updated_at": now
        })

        data["completed"] = new_status
        data["updated_at"] = now
        return {
            "id": doc_ref.id,
            "title": data.get("title", ""),
            "note": data.get("note", ""),
            "flower": data.get("flower", "lavender"),
            "priority": data.get("priority", "medium"),
            "completed": new_status,
            "created_at": data.get("created_at", ""),
            "updated_at": now,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error toggling todo: {str(e)}"
        )

@app.delete("/api/todos/{todo_id}")
def delete_todo(
    todo_id: str,
    user_id: Optional[str] = Query(None),
    x_user_id: Optional[str] = Header(None, alias="X-User-Id")
):
    try:
        effective_user = user_id or x_user_id or "demo"
        todos_ref, clean_id = get_user_todos_collection(effective_user)
        doc_ref = todos_ref.document(todo_id)
        doc = doc_ref.get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Todo not found")

        doc_ref.delete()
        return {"status": "deleted", "id": todo_id, "user_id": clean_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting todo: {str(e)}"
        )

# ==========================================
# NOTEBOOKS & NOTES (SANCTUARY JOURNAL) API
# ==========================================

@app.get("/api/notebooks", response_model=List[NotebookResponse])
@app.get("/notebooks", response_model=List[NotebookResponse])
def get_notebooks(
    user_id: Optional[str] = Query(None),
    x_user_id: Optional[str] = Header(None, alias="X-User-Id")
):
    try:
        effective_user = user_id or x_user_id or "demo"
        notebooks_ref, clean_id = get_user_notebooks_collection(effective_user)
        notes_ref, _ = get_user_notes_collection(effective_user)
        nb_docs = list(notebooks_ref.stream())

        # If zero notebooks, seed initial notebooks & notes
        if len(nb_docs) == 0:
            now = datetime.datetime.utcnow().isoformat()
            if clean_id == "demo":
                for nb in DEMO_SEED_NOTEBOOKS:
                    nb_id = nb["id"]
                    notebooks_ref.document(nb_id).set({
                        "title": nb["title"],
                        "flower": nb["flower"],
                        "icon": nb["icon"],
                        "description": nb["description"],
                        "created_at": now
                    })
                for note in DEMO_SEED_NOTES:
                    notes_ref.add({
                        **note,
                        "created_at": now,
                        "updated_at": now
                    })
            else:
                # 1 starter notebook for new users
                _, doc_ref = notebooks_ref.add({
                    **NEW_USER_SEED_NOTEBOOK,
                    "created_at": now
                })
                notes_ref.add({
                    **NEW_USER_SEED_NOTE,
                    "notebook_id": doc_ref.id,
                    "created_at": now,
                    "updated_at": now
                })

            nb_docs = list(notebooks_ref.stream())

        # Fetch all notes to compute note counts
        all_notes = list(notes_ref.stream())
        count_map = {}
        for n in all_notes:
            nd = n.to_dict()
            nid = nd.get("notebook_id", "")
            count_map[nid] = count_map.get(nid, 0) + 1

        result = []
        for doc in nb_docs:
            d = doc.to_dict()
            result.append({
                "id": doc.id,
                "title": d.get("title", ""),
                "flower": d.get("flower", "rose"),
                "icon": d.get("icon", "🌸"),
                "description": d.get("description", ""),
                "note_count": count_map.get(doc.id, 0),
                "created_at": d.get("created_at", datetime.datetime.utcnow().isoformat()),
            })

        result.sort(key=lambda x: x.get("created_at", ""))
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching notebooks: {str(e)}"
        )

@app.post("/api/notebooks", response_model=NotebookResponse, status_code=status.HTTP_201_CREATED)
def create_notebook(
    notebook: NotebookCreate,
    user_id: Optional[str] = Query(None),
    x_user_id: Optional[str] = Header(None, alias="X-User-Id")
):
    try:
        effective_user = user_id or x_user_id or "demo"
        notebooks_ref, clean_id = get_user_notebooks_collection(effective_user)
        now = datetime.datetime.utcnow().isoformat()
        nb_data = {
            "title": notebook.title.strip(),
            "flower": notebook.flower or "rose",
            "icon": notebook.icon or "🌸",
            "description": (notebook.description or "").strip(),
            "created_at": now
        }
        _, doc_ref = notebooks_ref.add(nb_data)
        return {
            "id": doc_ref.id,
            "note_count": 0,
            **nb_data
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating notebook: {str(e)}"
        )

@app.delete("/api/notebooks/{notebook_id}")
def delete_notebook(
    notebook_id: str,
    user_id: Optional[str] = Query(None),
    x_user_id: Optional[str] = Header(None, alias="X-User-Id")
):
    try:
        effective_user = user_id or x_user_id or "demo"
        notebooks_ref, clean_id = get_user_notebooks_collection(effective_user)
        notes_ref, _ = get_user_notes_collection(effective_user)

        doc_ref = notebooks_ref.document(notebook_id)
        if not doc_ref.get().exists:
            raise HTTPException(status_code=404, detail="Notebook not found")

        doc_ref.delete()

        # Delete notes belonging to this notebook
        notes_to_del = notes_ref.where("notebook_id", "==", notebook_id).stream()
        for nd in notes_to_del:
            notes_ref.document(nd.id).delete()

        return {"status": "deleted", "id": notebook_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting notebook: {str(e)}"
        )

@app.get("/api/notes", response_model=List[NoteResponse])
@app.get("/notes", response_model=List[NoteResponse])
def get_notes(
    notebook_id: Optional[str] = Query(None),
    user_id: Optional[str] = Query(None),
    x_user_id: Optional[str] = Header(None, alias="X-User-Id")
):
    try:
        effective_user = user_id or x_user_id or "demo"
        notes_ref, clean_id = get_user_notes_collection(effective_user)
        
        if notebook_id:
            docs = list(notes_ref.where("notebook_id", "==", notebook_id).stream())
        else:
            docs = list(notes_ref.stream())

        result = []
        for doc in docs:
            d = doc.to_dict()
            content = d.get("content", "")
            w_count = d.get("word_count", len(content.strip().split()) if content.strip() else 0)
            result.append({
                "id": doc.id,
                "notebook_id": d.get("notebook_id", ""),
                "title": d.get("title", ""),
                "content": content,
                "flower": d.get("flower", "rose"),
                "mood": d.get("mood", "calm"),
                "word_count": w_count,
                "created_at": d.get("created_at", datetime.datetime.utcnow().isoformat()),
                "updated_at": d.get("updated_at", datetime.datetime.utcnow().isoformat()),
            })

        result.sort(key=lambda x: x.get("created_at", ""), reverse=True)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching notes: {str(e)}"
        )

@app.post("/api/notes", response_model=NoteResponse, status_code=status.HTTP_201_CREATED)
def create_note(
    note: NoteCreate,
    user_id: Optional[str] = Query(None),
    x_user_id: Optional[str] = Header(None, alias="X-User-Id")
):
    try:
        effective_user = user_id or x_user_id or "demo"
        notes_ref, clean_id = get_user_notes_collection(effective_user)
        now = datetime.datetime.utcnow().isoformat()
        content = (note.content or "").strip()
        word_count = len(content.split()) if content else 0
        note_data = {
            "notebook_id": note.notebook_id,
            "title": note.title.strip(),
            "content": content,
            "flower": note.flower or "rose",
            "mood": note.mood or "calm",
            "word_count": word_count,
            "created_at": now,
            "updated_at": now,
        }
        _, doc_ref = notes_ref.add(note_data)
        return {
            "id": doc_ref.id,
            **note_data
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating note: {str(e)}"
        )

@app.get("/api/notes/{note_id}", response_model=NoteResponse)
def get_note(
    note_id: str,
    user_id: Optional[str] = Query(None),
    x_user_id: Optional[str] = Header(None, alias="X-User-Id")
):
    try:
        effective_user = user_id or x_user_id or "demo"
        notes_ref, clean_id = get_user_notes_collection(effective_user)
        doc = notes_ref.document(note_id).get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Note not found")
        d = doc.to_dict()
        content = d.get("content", "")
        return {
            "id": doc.id,
            "notebook_id": d.get("notebook_id", ""),
            "title": d.get("title", ""),
            "content": content,
            "flower": d.get("flower", "rose"),
            "mood": d.get("mood", "calm"),
            "word_count": d.get("word_count", len(content.strip().split()) if content.strip() else 0),
            "created_at": d.get("created_at", datetime.datetime.utcnow().isoformat()),
            "updated_at": d.get("updated_at", datetime.datetime.utcnow().isoformat()),
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving note: {str(e)}"
        )

@app.put("/api/notes/{note_id}", response_model=NoteResponse)
def update_note(
    note_id: str,
    updates: NoteUpdate,
    user_id: Optional[str] = Query(None),
    x_user_id: Optional[str] = Header(None, alias="X-User-Id")
):
    try:
        effective_user = user_id or x_user_id or "demo"
        notes_ref, clean_id = get_user_notes_collection(effective_user)
        doc_ref = notes_ref.document(note_id)
        doc = doc_ref.get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Note not found")

        current_data = doc.to_dict()
        update_dict = {}

        if updates.title is not None:
            update_dict["title"] = updates.title.strip()
        if updates.content is not None:
            content = updates.content.strip()
            update_dict["content"] = content
            update_dict["word_count"] = len(content.split()) if content else 0
        if updates.flower is not None:
            update_dict["flower"] = updates.flower
        if updates.notebook_id is not None:
            update_dict["notebook_id"] = updates.notebook_id
        if updates.mood is not None:
            update_dict["mood"] = updates.mood

        update_dict["updated_at"] = datetime.datetime.utcnow().isoformat()
        doc_ref.update(update_dict)

        current_data.update(update_dict)
        return {
            "id": doc_ref.id,
            "notebook_id": current_data.get("notebook_id", ""),
            "title": current_data.get("title", ""),
            "content": current_data.get("content", ""),
            "flower": current_data.get("flower", "rose"),
            "mood": current_data.get("mood", "calm"),
            "word_count": current_data.get("word_count", 0),
            "created_at": current_data.get("created_at", ""),
            "updated_at": current_data.get("updated_at", ""),
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating note: {str(e)}"
        )

@app.delete("/api/notes/{note_id}")
def delete_note(
    note_id: str,
    user_id: Optional[str] = Query(None),
    x_user_id: Optional[str] = Header(None, alias="X-User-Id")
):
    try:
        effective_user = user_id or x_user_id or "demo"
        notes_ref, clean_id = get_user_notes_collection(effective_user)
        doc_ref = notes_ref.document(note_id)
        if not doc_ref.get().exists:
            raise HTTPException(status_code=404, detail="Note not found")

        doc_ref.delete()
        return {"status": "deleted", "id": note_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting note: {str(e)}"
        )

# Serve Frontend SPA from dist
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

if dist_path.exists():
    assets_dir = dist_path / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="assets")

    @app.get("/{full_path:path}")
    def serve_frontend(full_path: str = ""):
        # Don't intercept API or docs routes
        if full_path.startswith("api") or full_path in ["docs", "redoc", "openapi.json", "health"]:
            raise HTTPException(status_code=404, detail="Not found")
        target_file = dist_path / full_path
        if full_path and target_file.exists() and target_file.is_file():
            return FileResponse(str(target_file))
        return FileResponse(str(dist_path / "index.html"))
