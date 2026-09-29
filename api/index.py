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

# Pre-populated seed data
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
