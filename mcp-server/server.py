"""MCP Server for Todo API - wraps Phase 2 REST APIs as MCP tools using OpenAI SDK."""

import os
import json
import requests
from typing import Optional
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI

# Load environment variables
load_dotenv()

# ---------------- CONFIGURATION ----------------
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")
LLM_MODEL = os.getenv("LLM_MODEL", "gpt-3.5-turbo")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY must be set in .env file")

# Initialize OpenAI client
client = OpenAI(api_key=OPENAI_API_KEY)

# ---------------- SYSTEM PROMPT ----------------
SYSTEM_PROMPT = """You are a todo management assistant. You help users manage their todos through natural language commands.

Available operations:
- CREATE todo: "add [task]", "create [task]", "remind me to [task]"
- LIST todos: "list", "show my todos", "what do I need to do"
- COMPLETE todo: "complete [task/id]", "finish [task]", "mark [task] as done"
- UPDATE todo: "update [task] to [new title]", "change [task] to [new title]", "rename [task]"
- DELETE todo: "delete [task/id]", "remove [task]"

CRITICAL RULES:
1. NEVER hallucinate or invent todo IDs or titles
2. ONLY use data returned from backend responses
3. Ask clarification if command is ambiguous
4. Use list_todos for fuzzy title matching
5. Always pass JWT token to backend
"""

# ---------------- BACKEND TOOLS ----------------
def create_todo(title: str, jwt_token: str) -> dict:
    if not jwt_token:
        return {"error": "JWT token required"}
    try:
        res = requests.post(
            f"{BACKEND_URL}/api/todos",
            json={"title": title},
            headers={"Authorization": f"Bearer {jwt_token}"},
            timeout=5
        )
        if res.status_code == 201:
            return res.json()
        return {"error": res.json().get("detail", "Failed to create todo"), "status_code": res.status_code}
    except Exception as e:
        return {"error": str(e)}

def list_todos(jwt_token: str, status_filter: Optional[str] = None) -> dict:
    if not jwt_token:
        return {"error": "JWT token required"}
    try:
        res = requests.get(
            f"{BACKEND_URL}/api/todos",
            headers={"Authorization": f"Bearer {jwt_token}"},
            timeout=5
        )
        if res.status_code == 200:
            todos = res.json().get("todos", [])
            if status_filter:
                todos = [t for t in todos if t.get("status") == status_filter]
            return {"todos": todos}
        return {"error": res.json().get("detail", "Failed to list todos"), "status_code": res.status_code}
    except Exception as e:
        return {"error": str(e)}

def complete_todo(todo_id: int, jwt_token: str) -> dict:
    if not jwt_token:
        return {"error": "JWT token required"}
    try:
        res = requests.patch(
            f"{BACKEND_URL}/api/todos/{todo_id}/complete",
            headers={"Authorization": f"Bearer {jwt_token}"},
            timeout=5
        )
        if res.status_code == 200:
            return res.json()
        return {"error": res.json().get("detail", "Failed to complete todo"), "status_code": res.status_code}
    except Exception as e:
        return {"error": str(e)}

def update_todo(todo_id: int, new_title: str, jwt_token: str) -> dict:
    if not jwt_token:
        return {"error": "JWT token required"}
    try:
        res = requests.patch(
            f"{BACKEND_URL}/api/todos/{todo_id}",
            json={"title": new_title},
            headers={"Authorization": f"Bearer {jwt_token}"},
            timeout=5
        )
        if res.status_code == 200:
            return res.json()
        return {"error": res.json().get("detail", "Failed to update todo"), "status_code": res.status_code}
    except Exception as e:
        return {"error": str(e)}

def delete_todo(todo_id: int, jwt_token: str) -> dict:
    if not jwt_token:
        return {"error": "JWT token required"}
    try:
        res = requests.delete(
            f"{BACKEND_URL}/api/todos/{todo_id}",
            headers={"Authorization": f"Bearer {jwt_token}"},
            timeout=5
        )
        if res.status_code == 204:
            return {"success": True, "message": "Todo deleted"}
        return {"error": res.json().get("detail", "Failed to delete todo"), "status_code": res.status_code}
    except Exception as e:
        return {"error": str(e)}

# ---------------- MCP TOOL CALL ----------------
def process_tool_call(tool_name: str, tool_input: dict, jwt_token: str) -> dict:
    if tool_name == "create_todo":
        return create_todo(tool_input.get("title"), jwt_token)
    elif tool_name == "list_todos":
        return list_todos(jwt_token, tool_input.get("status_filter"))
    elif tool_name == "complete_todo":
        return complete_todo(tool_input.get("todo_id"), jwt_token)
    elif tool_name == "update_todo":
        return update_todo(tool_input.get("todo_id"), tool_input.get("new_title"), jwt_token)
    elif tool_name == "delete_todo":
        return delete_todo(tool_input.get("todo_id"), jwt_token)
    return {"error": f"Unknown tool: {tool_name}"}

# ---------------- CHAT FUNCTION ----------------
def chat(message: str, jwt_token: str) -> str:
    if not jwt_token:
        return "Error: Authentication required. Please login."

    try:
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": message}
        ]

        response = client.chat.completions.create(
            model=LLM_MODEL,
            messages=messages,
            max_tokens=1024
        )

        return response.choices[0].message.get("content", "I processed your request.")

    except Exception as e:
        return f"Error processing command: {str(e)}"

# ---------------- FLASK APP ----------------
app = Flask(__name__)
CORS(app)  # Allow frontend calls

@app.route('/api/chat', methods=['POST'])
def chat_endpoint():
    data = request.get_json()
    if not data or not data.get("message"):
        return jsonify({"error": "Message required"}), 400

    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        return jsonify({"error": "Authentication required"}), 401

    resp = chat(data["message"], token)
    return jsonify({"response": resp})

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "service": "mcp-todo-server"})

# ---------------- MAIN ----------------
if __name__ == "__main__":
    print("Starting MCP Todo Server on http://localhost:5000")
    port = int(os.getenv("MCP_PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
