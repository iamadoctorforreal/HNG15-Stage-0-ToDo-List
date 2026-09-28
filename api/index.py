import os
import datetime
from typing import Optional, List
from pathlib import Path
from fastapi import FastAPI, HTTPException, status
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
    description="Full-stack FastAPI backend powered by Firebase Firestore",
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

@app.get("/api/health")
def health_check():
    try:
        db = get_firestore_client()
        return {
            "status": "healthy",
            "database": "firebase_firestore_connected",
            "project_id": os.getenv("FIREBASE_PROJECT_ID"),
            "timestamp": datetime.datetime.utcnow().isoformat()
        }
    except Exception as e:
        return {
            "status": "degraded",
            "database_error": str(e),
            "timestamp": datetime.datetime.utcnow().isoformat()
        }

@app.get("/api/todos", response_model=List[TodoResponse])
def get_todos():
    try:
        db = get_firestore_client()
        todos_ref = db.collection("todos")
        docs = todos_ref.stream()

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
def create_todo(todo: TodoCreate):
    try:
        db = get_firestore_client()
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

        update_time, doc_ref = db.collection("todos").add(todo_data)
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
def get_todo(todo_id: str):
    try:
        db = get_firestore_client()
        doc = db.collection("todos").document(todo_id).get()
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
def update_todo(todo_id: str, updates: TodoUpdate):
    try:
        db = get_firestore_client()
        doc_ref = db.collection("todos").document(todo_id)
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
def toggle_todo(todo_id: str):
    try:
        db = get_firestore_client()
        doc_ref = db.collection("todos").document(todo_id)
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
def delete_todo(todo_id: str):
    try:
        db = get_firestore_client()
        doc_ref = db.collection("todos").document(todo_id)
        doc = doc_ref.get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Todo not found")

        doc_ref.delete()
        return {"status": "deleted", "id": todo_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting todo: {str(e)}"
        )
