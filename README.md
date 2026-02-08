# Phase 3: AI-Driven Todo Chatbot

This phase adds natural language processing capabilities to the Todo application, allowing users to manage their tasks through conversational commands.

## Overview

Phase 3 implements an AI chatbot interface that:
- Understands natural language commands for todo management
- Uses Claude (Anthropic) for intent recognition and safe action mapping
- Calls existing Phase 2 backend APIs via MCP tools
- Maintains stateless operation with database as source of truth
- Provides a collapsible chat panel in the frontend

## Architecture

```
┌─────────────────┐
│  Frontend (UI)  │
│  ChatPanel.tsx  │
└────────┬────────┘
         │ HTTP POST /api/chat
         ▼
┌─────────────────┐
│  MCP Server     │
│  Flask + AI     │
│  (port 5000)    │
└────────┬────────┘
         │ MCP Tools
         ▼
┌─────────────────┐
│  Phase 2 Backend│
│  FastAPI        │
│  (port 8000)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  PostgreSQL     │
│  (Neon DB)      │
└─────────────────┘
```

## Features

### Supported Natural Language Commands

1. **CREATE**: Add new todos
   - "add buy groceries"
   - "create a task to review code"
   - "remind me to call mom"

2. **LIST**: View todos
   - "list my todos"
   - "show me my tasks"
   - "what do I need to do?"
   - "show pending" / "show completed"

3. **COMPLETE**: Mark todos as done
   - "complete buy groceries"
   - "mark task 5 as done"
   - "finish the code review task"

4. **UPDATE**: Change todo titles
   - "update buy milk to buy almond milk"
   - "rename task 3 to review security audit"
   - "change the groceries task to buy organic groceries"

5. **DELETE**: Remove todos
   - "delete buy groceries"
   - "remove task 7"
   - "get rid of the completed tasks" (with safety confirmation)

### AI Safety Features

- **No Hallucinations**: AI only uses data from backend responses
- **Authentication**: All operations require valid JWT token
- **Fuzzy Matching**: Intelligent title matching for updates/completions/deletions
- **Clarification Requests**: Asks for clarification when commands are ambiguous
- **Error Handling**: Gracefully handles backend errors (401, 403, 404)
- **Bulk Operation Safety**: Confirms before deleting multiple todos

## Setup Instructions

### Prerequisites

- Phase 2 backend and frontend running (see `../phase-2/README.md`)
- Python 3.9 or higher
- Node.js 18+ (for frontend)
- Anthropic API key

### 1. Configure Environment

Create `.env` file in `phase-3/mcp-server/`:

```bash
cd phase-3/mcp-server
cp .env.example .env
```

Edit `.env` with your settings:

```env
BACKEND_URL=http://localhost:8000
MCP_PORT=5000
ANTHROPIC_API_KEY=your-actual-api-key-here
LLM_MODEL=claude-3-haiku-20240307
```

**Get API Key**: Sign up at https://console.anthropic.com/

### 2. Install MCP Server Dependencies

```bash
cd phase-3/mcp-server
pip install -r requirements.txt
```

Dependencies:
- `anthropic` - Claude AI SDK
- `flask` - HTTP server
- `flask-cors` - CORS support for frontend
- `requests` - HTTP client for backend calls
- `python-dotenv` - Environment variable loading

### 3. Configure Frontend

Add to `phase-2/frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_MCP_SERVER_URL=http://localhost:5000
```

### 4. Start Services

**Terminal 1 - Phase 2 Backend**:
```bash
cd phase-2/backend
python main.py
# Should start on http://localhost:8000
```

**Terminal 2 - MCP Server**:
```bash
cd phase-3/mcp-server
python server.py
# Should start on http://localhost:5000
```

**Terminal 3 - Frontend**:
```bash
cd phase-2/frontend
npm run dev
# Should start on http://localhost:3000
```

### 5. Verify Setup

1. **Check MCP Server Health**:
   ```bash
   curl http://localhost:5000/health
   # Should return: {"status":"ok","service":"mcp-todo-server"}
   ```

2. **Login to Frontend**:
   - Visit http://localhost:3000
   - Login or signup
   - Navigate to `/todos` page

3. **Test Chat Panel**:
   - Click the "AI Todo Assistant" button at bottom-right
   - Try: "add test task"
   - Verify task appears in todo list

## MCP Tools Reference

The MCP server exposes 5 tools that wrap Phase 2 REST APIs:

### 1. create_todo
**Purpose**: Create new todo
**Input**: `{title: string}`
**Backend**: `POST /api/todos`
**Returns**: Created todo object

### 2. list_todos
**Purpose**: List all todos for user
**Input**: `{status_filter?: "pending" | "completed"}`
**Backend**: `GET /api/todos`
**Returns**: Array of todos

### 3. complete_todo
**Purpose**: Mark todo as completed
**Input**: `{todo_id: number}`
**Backend**: `PATCH /api/todos/{id}/complete`
**Returns**: Updated todo object

### 4. update_todo
**Purpose**: Update todo title
**Input**: `{todo_id: number, new_title: string}`
**Backend**: `PATCH /api/todos/{id}`
**Returns**: Updated todo object

### 5. delete_todo
**Purpose**: Delete todo
**Input**: `{todo_id: number}`
**Backend**: `DELETE /api/todos/{id}`
**Returns**: Success confirmation

## Testing

### Manual Acceptance Tests

**User Story 1 - Create**:
1. Type "add buy groceries" → Verify todo created
2. Type "remind me to call mom" → Verify todo created

**User Story 2 - List**:
1. Type "list my todos" → Verify all todos displayed
2. Type "show pending" → Verify only pending shown

**User Story 3 - Complete**:
1. Type "complete buy groceries" → Verify status changed
2. Type "mark task 1 as done" → Verify works with ID

**User Story 4 - Update**:
1. Type "update buy milk to buy almond milk" → Verify title changed
2. Type "rename task 2 to new title" → Verify works with ID

**User Story 5 - Delete**:
1. Type "delete buy groceries" → Verify todo removed
2. Type "delete all completed" → Verify confirmation requested

### Intent Classification Test

Test 20 sample commands to verify >90% accuracy:

```
✅ "add X" → CREATE
✅ "list" → LIST
✅ "complete X" → COMPLETE
✅ "update X to Y" → UPDATE
✅ "delete X" → DELETE
```

### Safety Test

1. **No Hallucinations**: Type "what todos do I have" with empty list → AI should say "none", not invent todos
2. **Authentication**: Remove token → AI should request login
3. **Error Handling**: Stop backend → AI should explain connection error

## Troubleshooting

### MCP Server won't start
- **Check**: ANTHROPIC_API_KEY is set in `.env`
- **Check**: Port 5000 is not already in use
- **Fix**: `killall -9 python` or change MCP_PORT in `.env`

### Chat returns "Authentication required"
- **Check**: You're logged in to the frontend
- **Check**: Token is saved in localStorage
- **Fix**: Logout and login again

### Chat returns connection error
- **Check**: Phase 2 backend is running on port 8000
- **Check**: MCP server is running on port 5000
- **Fix**: Start both servers

### AI doesn't understand command
- **Check**: Command matches supported patterns (see Features section)
- **Try**: Rephrase using example commands
- **Example**: Instead of "I need to buy milk", try "add buy milk"

## Project Structure

```
phase-3/
├── mcp-server/
│   ├── server.py           # Flask app + AI agent + MCP tools
│   ├── requirements.txt    # Python dependencies
│   ├── .env.example        # Environment template
│   └── tools/              # (empty - tools defined in server.py)
├── frontend-additions/
│   └── ChatPanel.tsx       # AI chat interface component
└── README.md               # This file
```

## Development Notes

### Why Flask instead of FastMCP?
- Simpler HTTP endpoint exposure
- Easier debugging and testing
- Direct integration with Anthropic SDK
- Meets all Phase 3 requirements

### Why Anthropic Claude?
- Built-in tool use capability
- Strong intent classification
- Safety-focused (reduces hallucinations)
- Cost-effective (Haiku model)

### Design Decisions
1. **Stateless AI**: No conversation history storage (per Constitution Principle V)
2. **MCP Tools Only**: AI never calls backend directly (per Constitution Principle VI)
3. **Phase 2 Unchanged**: Zero changes to existing backend (per spec constraint)
4. **Minimal Frontend**: Single ChatPanel component added (per spec constraint)

## Next Steps (Future Phases)

Phase 3 is **complete** when:
- ✅ User can create, list, complete, update, delete todos via natural language
- ✅ AI correctly maps intents to backend API calls
- ✅ No unauthorized or unsafe actions
- ✅ App runs locally without errors

**Potential Phase 4**:
- Docker and Kubernetes deployment
- Advanced NLP features
- Multi-turn conversations
- Proactive todo suggestions

## License

See main project LICENSE file.
