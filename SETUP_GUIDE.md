# Phase 3 Quick Setup Guide

## Prerequisites Checklist

- [ ] Phase 2 backend running on http://localhost:8000
- [ ] Phase 2 frontend running on http://localhost:3000
- [ ] Python 3.9+ installed
- [ ] Anthropic API key (get from https://console.anthropic.com/)

## Setup Steps

### 1. Configure MCP Server

```bash
cd phase-3/mcp-server

# Copy environment template
cp .env.example .env

# Edit .env and add your API key
nano .env  # or use your favorite editor
```

In `.env`, set:
```
ANTHROPIC_API_KEY=sk-ant-xxxxx  # Your actual API key
BACKEND_URL=http://localhost:8000
MCP_PORT=5000
LLM_MODEL=claude-3-haiku-20240307
```

### 2. Install Dependencies

```bash
# In phase-3/mcp-server/
pip install -r requirements.txt
```

### 3. Configure Frontend

Add to `phase-2/frontend/.env.local`:
```
NEXT_PUBLIC_MCP_SERVER_URL=http://localhost:5000
```

### 4. Start All Services

**Terminal 1 - Backend**:
```bash
cd phase-2/backend
python main.py
```

**Terminal 2 - MCP Server**:
```bash
cd phase-3/mcp-server
python server.py
```

**Terminal 3 - Frontend**:
```bash
cd phase-2/frontend
npm run dev
```

### 5. Test

1. Visit http://localhost:3000
2. Login (or signup)
3. Click "AI Todo Assistant" button at bottom-right
4. Try: "add buy groceries"
5. Verify todo appears in list

## Quick Test Commands

```
add buy groceries
list my todos
complete buy groceries
update buy milk to buy almond milk
delete the test task
```

## Troubleshooting

**"Authentication required" error**:
- Make sure you're logged in
- Check localStorage has a valid token

**"Connection error"**:
- Verify all 3 services are running
- Check ports 3000, 5000, 8000

**"Invalid API key"**:
- Verify ANTHROPIC_API_KEY in phase-3/mcp-server/.env
- Get new key from https://console.anthropic.com/

## Architecture

```
Frontend (3000) → MCP Server (5000) → Backend (8000) → Database
     ↑                 ↑                    ↑
  ChatPanel     Claude AI + Tools     Phase 2 APIs
```

## What Works

✅ Natural language todo creation
✅ Natural language todo listing
✅ Natural language todo completion
✅ Natural language todo updates
✅ Natural language todo deletion
✅ JWT authentication maintained
✅ Fuzzy title matching
✅ Error handling
✅ Safety features (no hallucinations)

## What Changed

**NEW files**:
- `phase-3/mcp-server/server.py` - AI agent + MCP tools
- `phase-2/frontend/components/ChatPanel.tsx` - Chat UI

**MODIFIED files**:
- `phase-2/frontend/pages/todos.tsx` - Added ChatPanel component

**UNCHANGED**:
- `phase-2/backend/` - No changes (zero modifications)
- Database schema - No changes

## Success Criteria

- [ ] Can create todos: "add buy groceries"
- [ ] Can list todos: "list my todos"
- [ ] Can complete todos: "complete buy groceries"
- [ ] Can update todos: "update buy milk to buy almond milk"
- [ ] Can delete todos: "delete the task"
- [ ] AI handles ambiguous commands with clarification
- [ ] AI never hallucinates todo IDs or titles
- [ ] Authentication works (JWT required)
- [ ] Phase 2 backend unchanged (verify with `git diff phase-2/backend`)

## Next Steps

Once everything works:
1. Test all 5 user stories (see README.md)
2. Verify safety features
3. Ready for demo!

For detailed documentation, see `phase-3/README.md`.
