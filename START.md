# Complete Startup Guide - Phase 3 AI Todo Chatbot

## Prerequisites Check

- [ ] Python 3.9+ installed
- [ ] Node.js 18+ installed
- [ ] PostgreSQL (Neon) database configured
- [ ] OpenRouter API key set in phase-3/mcp-server/.env

## Step-by-Step Startup

### Step 1: Start Backend (Terminal 1)

```powershell
# Open PowerShell Terminal 1
cd "E:\hackathon 2\todos\phase-2\backend"
python main.py
```

**Expected Output:**
```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Test Backend:**
```powershell
# In another terminal:
curl http://localhost:8000/health
# Should return: {"status":"ok"}
```

---

### Step 2: Start MCP Server (Terminal 2)

```powershell
# Open PowerShell Terminal 2
cd "E:\hackathon 2\todos\phase-3\mcp-server"
python server.py
```

**Expected Output:**
```
MCP Server for Todo API (using OpenRouter)
Tools available: ['create_todo', 'list_todos', 'complete_todo', 'update_todo', 'delete_todo']
Model: gpt-3.5-turbo

Starting Flask server on http://localhost:5000
 * Running on http://127.0.0.1:5000
```

**Test MCP Server:**
```powershell
# In another terminal:
curl http://localhost:5000/health
# Should return: {"service":"mcp-todo-server","status":"ok"}
```

---

### Step 3: Start Frontend (Terminal 3)

```powershell
# Open PowerShell Terminal 3
cd "E:\hackathon 2\todos\phase-2\frontend"
npm run dev
```

**Expected Output:**
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
- event compiled client and server successfully
```

**Test Frontend:**
```
Open browser: http://localhost:3000
```

---

## Quick Health Check

Run this to check all services:

```powershell
# Backend
curl http://localhost:8000/health

# MCP Server
curl http://localhost:5000/health

# Frontend
curl http://localhost:3000
```

---

## Test AI Chatbot

1. **Login to Frontend:**
   - Go to http://localhost:3000
   - Login or signup
   - You'll be redirected to /todos page

2. **Open Chat Panel:**
   - Look at bottom-right corner
   - Click "AI Todo Assistant"
   - Panel should slide up

3. **Test Commands:**
   ```
   add buy groceries
   list my todos
   complete buy groceries
   update buy milk to buy almond milk
   delete the test task
   ```

---

## Troubleshooting

### Backend won't start
- **Check:** PostgreSQL connection in .env
- **Check:** Port 8000 is not in use
- **Fix:** Update DATABASE_URL in phase-2/backend/.env

### MCP Server won't start
- **Error:** "OPENROUTER_API_KEY must be set"
  - **Fix:** Add API key to phase-3/mcp-server/.env
- **Error:** Port 5000 already in use
  - **Fix:** Change MCP_PORT in .env

### Frontend won't start
- **Error:** Port 3000 in use
  - **Fix:** Kill process on port 3000
- **Error:** Environment variables not loading
  - **Fix:** Restart frontend server (Ctrl+C, then npm run dev)

### Chat returns "Connection refused"
- **Check:** All 3 services running
- **Check:** .env.local has NEXT_PUBLIC_MCP_SERVER_URL=http://localhost:5000
- **Fix:** Restart frontend

### AI doesn't respond
- **Check:** OpenRouter API key is correct
- **Check:** MCP server terminal for errors
- **Test:** curl -X POST http://localhost:5000/api/chat -H "Content-Type: application/json" -H "Authorization: Bearer test" -d "{\"message\": \"hello\"}"

---

## Full System Test

Once all services are running, test this flow:

1. **Create via AI:** "add buy groceries"
2. **Verify in UI:** Check todo appears in list above
3. **List via AI:** "list my todos"
4. **Complete via AI:** "complete buy groceries"
5. **Verify in UI:** Todo should show as completed
6. **Delete via AI:** "delete buy groceries"
7. **Verify in UI:** Todo should disappear

---

## Service Status Overview

| Service | Port | Health Check | Status |
|---------|------|--------------|--------|
| Backend | 8000 | /health | ⚪ |
| MCP Server | 5000 | /health | ⚪ |
| Frontend | 3000 | / | ⚪ |

Legend: ✅ Running | ❌ Stopped | ⚪ Unknown

---

## Stop All Services

Press **Ctrl+C** in each terminal to stop:
1. Terminal 1 (Backend)
2. Terminal 2 (MCP Server)
3. Terminal 3 (Frontend)

---

## Quick Start (PowerShell Script)

Save this as `start-phase3.ps1`:

```powershell
# Start all services in separate windows
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'E:\hackathon 2\todos\phase-2\backend'; python main.py"
Start-Sleep -Seconds 2
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'E:\hackathon 2\todos\phase-3\mcp-server'; python server.py"
Start-Sleep -Seconds 2
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'E:\hackathon 2\todos\phase-2\frontend'; npm run dev"

Write-Host "All services starting..."
Write-Host "Backend: http://localhost:8000"
Write-Host "MCP Server: http://localhost:5000"
Write-Host "Frontend: http://localhost:3000"
```

Run with: `powershell -ExecutionPolicy Bypass -File start-phase3.ps1`

---

## Success Criteria

- [ ] Backend responds on port 8000
- [ ] MCP Server responds on port 5000
- [ ] Frontend loads on port 3000
- [ ] Can login to frontend
- [ ] Chat panel opens
- [ ] "add buy groceries" creates a todo
- [ ] Todo appears in UI list
- [ ] "list my todos" shows todos
- [ ] "complete buy groceries" works
- [ ] "delete buy groceries" works

---

**Ready to test!** 🚀

Start each service in order (Backend → MCP → Frontend) and test!
