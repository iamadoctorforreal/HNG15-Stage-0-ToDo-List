import os
import sys
import unittest
from pathlib import Path
from starlette.testclient import TestClient

# Ensure root directory is in sys.path
root_dir = Path(__file__).resolve().parent.parent
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

from api.index import app

class TestBloomAPI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)
        cls.test_user = "agent_validator_test@bloom.app"

    def test_01_health_check(self):
        """Validate /api/health endpoint status and database connectivity."""
        response = self.client.get("/api/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data.get("status"), "healthy")
        self.assertEqual(data.get("database"), "firebase_firestore_connected")
        self.assertEqual(data.get("isolation"), "per_user_subcollections")

    def test_02_todos_crud_and_isolation(self):
        """Validate Todos CRUD and user data isolation."""
        # 1. Demo user has seeded tasks
        demo_resp = self.client.get("/api/todos?user_id=demo")
        self.assertEqual(demo_resp.status_code, 200)
        demo_todos = demo_resp.json()
        self.assertGreaterEqual(len(demo_todos), 4)

        # 2. Create todo for isolated test user
        new_todo = {
            "title": "Agent Automated Test Task 🌸",
            "note": "Testing endpoint validation and data isolation",
            "flower": "rose",
            "priority": "high",
            "completed": False
        }
        create_resp = self.client.post(
            f"/api/todos?user_id={self.test_user}",
            json=new_todo
        )
        self.assertEqual(create_resp.status_code, 201)
        created_data = create_resp.json()
        todo_id = created_data.get("id")
        self.assertTrue(todo_id)
        self.assertEqual(created_data.get("title"), new_todo["title"])

        # 3. Retrieve single todo
        get_resp = self.client.get(f"/api/todos/{todo_id}?user_id={self.test_user}")
        self.assertEqual(get_resp.status_code, 200)
        self.assertEqual(get_resp.json().get("id"), todo_id)

        # 4. Toggle completion
        toggle_resp = self.client.patch(f"/api/todos/{todo_id}/toggle?user_id={self.test_user}")
        self.assertEqual(toggle_resp.status_code, 200)
        self.assertTrue(toggle_resp.json().get("completed"))

        # 5. Update todo
        update_resp = self.client.put(
            f"/api/todos/{todo_id}?user_id={self.test_user}",
            json={"title": "Updated Agent Test Task", "note": "Updated note content"}
        )
        self.assertEqual(update_resp.status_code, 200)
        self.assertEqual(update_resp.json().get("title"), "Updated Agent Test Task")

        # 6. Delete todo
        del_resp = self.client.delete(f"/api/todos/{todo_id}?user_id={self.test_user}")
        self.assertEqual(del_resp.status_code, 200)
        self.assertEqual(del_resp.json().get("status"), "deleted")

        # Verify deletion does not affect demo user
        demo_verify_resp = self.client.get("/api/todos?user_id=demo")
        self.assertEqual(demo_verify_resp.status_code, 200)
        self.assertGreaterEqual(len(demo_verify_resp.json()), 4)

    def test_03_notebooks_crud(self):
        """Validate Sanctuary Journal Notebooks CRUD."""
        # 1. Fetch demo notebooks
        nb_resp = self.client.get("/api/notebooks?user_id=demo")
        self.assertEqual(nb_resp.status_code, 200)
        notebooks = nb_resp.json()
        self.assertGreaterEqual(len(notebooks), 3)

        # 2. Create new notebook
        new_nb = {
            "title": "Agent Reflection Log",
            "flower": "lavender",
            "icon": "🪻",
            "description": "Validation notebook created by test agent"
        }
        create_resp = self.client.post(
            f"/api/notebooks?user_id={self.test_user}",
            json=new_nb
        )
        self.assertEqual(create_resp.status_code, 201)
        nb_data = create_resp.json()
        nb_id = nb_data.get("id")
        self.assertTrue(nb_id)
        self.assertEqual(nb_data.get("title"), new_nb["title"])

        # 3. Delete notebook
        del_resp = self.client.delete(f"/api/notebooks/{nb_id}?user_id={self.test_user}")
        self.assertEqual(del_resp.status_code, 200)
        self.assertEqual(del_resp.json().get("status"), "deleted")

    def test_04_notes_crud(self):
        """Validate Sanctuary Journal Notes CRUD and word count calculation."""
        # 1. Fetch demo notes
        notes_resp = self.client.get("/api/notes?user_id=demo")
        self.assertEqual(notes_resp.status_code, 200)
        self.assertGreaterEqual(len(notes_resp.json()), 3)

        # 2. Create note for test user
        new_note = {
            "notebook_id": "agent-test-nb",
            "title": "Morning Thoughts from Agent Test",
            "content": "Peaceful reflections in the floral sanctuary. Calm minds build beautiful things.",
            "flower": "rose",
            "mood": "serene"
        }
        create_resp = self.client.post(
            f"/api/notes?user_id={self.test_user}",
            json=new_note
        )
        self.assertEqual(create_resp.status_code, 201)
        note_data = create_resp.json()
        note_id = note_data.get("id")
        self.assertTrue(note_id)
        self.assertEqual(note_data.get("word_count"), 11)

        # 3. Retrieve note
        get_resp = self.client.get(f"/api/notes/{note_id}?user_id={self.test_user}")
        self.assertEqual(get_resp.status_code, 200)
        self.assertEqual(get_resp.json().get("title"), new_note["title"])

        # 4. Update note
        update_resp = self.client.put(
            f"/api/notes/{note_id}?user_id={self.test_user}",
            json={"title": "Updated Note Title", "content": "Only five words here now"}
        )
        self.assertEqual(update_resp.status_code, 200)
        self.assertEqual(update_resp.json().get("word_count"), 5)

        # 5. Delete note
        del_resp = self.client.delete(f"/api/notes/{note_id}?user_id={self.test_user}")
        self.assertEqual(del_resp.status_code, 200)
        self.assertEqual(del_resp.json().get("status"), "deleted")

if __name__ == "__main__":
    unittest.main()
