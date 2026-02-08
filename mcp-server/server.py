"""
MCP Server for Todo API
Handles AI chatbot commands and performs real CRUD on Phase 2 backend
"""

import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")

app = Flask(__name__)
CORS(app)

# ---------------- TOOLS ----------------
def create_todo(title: str, token: str):
    try:
        res = requests.post(
            f"{BACKEND_URL}/api/todos",
            json={"title": title},
            headers={"Authorization": f"Bearer {token}"},
            timeout=5
        )
        if res.status_code == 201:
            return {"success": True, "todo": res.json()}
        else:
            return {"success": False, "error": res.json().get("detail", "Failed to create todo")}
    except Exception as e:
        return {"success": False, "error": str(e)}

def list_todos(token: str):
    try:
        res = requests.get(
            f"{BACKEND_URL}/api/todos",
            headers={"Authorization": f"Bearer {token}"},
            timeout=5
        )
        if res.status_code == 200:
            return res.json().get("todos", [])
        else:
            return []
    except Exception as e:
        return []

def complete_todo(todo_id: int, token: str):
    try:
        res = requests.patch(
            f"{BACKEND_URL}/api/todos/{todo_id}/complete",
            headers={"Authorization": f"Bearer {token}"},
            timeout=5
        )
        if res.status_code == 200:
            return {"success": True}
        return {"success": False, "error": res.json().get("detail", "Failed to complete todo")}
    except Exception as e:
        return {"success": False, "error": str(e)}

def update_todo(todo_id: int, new_title: str, token: str):
    try:
        res = requests.patch(
            f"{BACKEND_URL}/api/todos/{todo_id}",
            json={"title": new_title},
            headers={"Authorization": f"Bearer {token}"},
            timeout=5
        )
        if res.status_code == 200:
            return {"success": True}
        return {"success": False, "error": res.json().get("detail", "Failed to update todo")}
    except Exception as e:
        return {"success": False, "error": str(e)}

def delete_todo(todo_id: int, token: str):
    try:
        res = requests.delete(
            f"{BACKEND_URL}/api/todos/{todo_id}",
            headers={"Authorization": f"Bearer {token}"},
            timeout=5
        )
        if res.status_code == 204:
            return {"success": True}
        return {"success": False, "error": res.json().get("detail", "Failed to delete todo")}
    except Exception as e:
        return {"success": False, "error": str(e)}

# ---------------- CHAT LOGIC ----------------
def process_message(message: str, token: str):
    msg = message.lower().strip()

    # ---------- CREATE ----------
    if msg.startswith("add"):
        title = msg.replace("add", "").strip()
        result = create_todo(title, token)
        if result.get("success"):
            return f"✅ Task added: {title}"
        else:
            return f"❌ Failed to add task: {result.get('error')}"

    # ---------- LIST ----------
    if "list" in msg:
        todos = list_todos(token)
        if not todos:
            return "📭 No tasks found"
        return "\n".join([f"- [{t['status']}] {t['title']} (ID: {t['id']})" for t in todos])

    # ---------- COMPLETE ----------
    if msg.startswith("complete"):
        title = msg.replace("complete", "").strip()
        todos = list_todos(token)
        matched = next((t for t in todos if t['title'].lower() == title.lower()), None)
        if not matched:
            return "❌ Task not found"
        result = complete_todo(matched['id'], token)
        if result.get("success"):
            return f"✅ Task marked as complete: {title}"
        else:
            return f"❌ Failed to complete task: {result.get('error')}"

    # ---------- DELETE ----------
    if msg.startswith("delete"):
        title = msg.replace("delete", "").strip()
        todos = list_todos(token)
        matched = next((t for t in todos if t['title'].lower() == title.lower()), None)
        if not matched:
            return "❌ Task not found"
        result = delete_todo(matched['id'], token)
        if result.get("success"):
            return f"🗑️ Task deleted: {title}"
        else:
            return f"❌ Failed to delete task: {result.get('error')}"

    # ---------- UPDATE ----------
    if msg.startswith("update"):
        # Expected: update old_title to new_title
        if " to " not in msg:
            return "❌ Use format: update [old title] to [new title]"
        old_title, new_title = msg.replace("update", "").split(" to ")
        old_title = old_title.strip()
        new_title = new_title.strip()
        todos = list_todos(token)
        matched = next((t for t in todos if t['title'].lower() == old_title.lower()), None)
        if not matched:
            return "❌ Task not found"
        result = update_todo(matched['id'], new_title, token)
        if result.get("success"):
            return f"✏️ Task updated: {old_title} → {new_title}"
        else:
            return f"❌ Failed to update task: {result.get('error')}"

    return "❓ I didn’t understand. Try: add / list / complete / delete / update"

# ---------------- API ----------------
@app.route("/api/chat", methods=["POST"])
def chat():
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        return jsonify({"response": "Unauthorized"}), 401

    data = request.get_json()
    message = data.get("message", "")
    response = process_message(message, token)
    return jsonify({"response": response})

@app.route("/health")
def health():
    return jsonify({"status": "ok", "service": "mcp-server"})

if __name__ == "__main__":
    print("🚀 MCP Server running on port 5000")
    app.run(host="0.0.0.0", port=5000, debug=True)
