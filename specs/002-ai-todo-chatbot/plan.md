# Implementation Plan: AI-Driven Todo Chatbot

**Branch**: `003-ai-todo-chatbot` | **Date**: 2025-12-30 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-ai-todo-chatbot/spec.md`

## Summary

Add AI chatbot capabilities to Phase 2 web application without modifying existing backend or frontend architecture. Build an MCP server that wraps Phase 2 REST APIs as tools, and an AI agent that processes natural language commands and invokes tools deterministically. Add minimal chat UI to frontend for user interaction. Maintain stateless design, database as source of truth, and strict safety constraints to prevent hallucinations.

**Technical Approach**: Create MCP server (Python) that exposes 5 tools wrapping Phase 2 backend APIs. Build AI agent endpoint that receives natural language, classifies intent, extracts parameters, calls appropriate MCP tools with JWT, and returns formatted responses. Add chat component to Phase 2 frontend. No changes to existing backend APIs or database schema.

## Technical Context

**Language/Version**: Python 3.8+ (MCP server, AI agent), TypeScript (frontend chat component)
**Primary Dependencies**:
- MCP Server: mcp Python SDK, requests (for backend API calls)
- AI Agent: LLM SDK (anthropic for Claude or openai for GPT), fastmcp (simplified MCP server)
- Frontend: Existing Next.js stack (no new dependencies)
**Storage**: Database unchanged (Neon PostgreSQL from Phase 2)
**Testing**: Manual acceptance testing with natural language commands
**Target Platform**: Local development (MCP server on port 5000, existing backend on 8000, frontend on 3000)
**Project Type**: AI agent integration (adds AI layer to existing web app)
**Performance Goals**: AI response < 3 seconds; MCP tool calls < 500ms
**Constraints**: No backend changes; no DB changes; minimal frontend changes; MCP-only AI interaction; stateless agent
**Scale/Scope**: Single-user AI session (no multi-user chat); local development

## Constitution Check

*GATE: Must pass before implementation begins.*

### Principle I: Spec-First Development ✅
- Spec complete and approved in `specs/003-ai-todo-chatbot/spec.md`
- All user stories, MCP tools, domain rules, safety constraints documented
- No code written before spec approval

### Principle II: Phase Discipline ✅
- Phase 1: CLOSED (console app)
- Phase 2: CLOSED (web app with Neon PostgreSQL)
- Phase 3 Specification Phase: COMPLETE
- Phase 3 Planning Phase: IN PROGRESS (this document)
- Phase 3 Task Definition Phase: BLOCKED
- **No Phase Overlap**: Phase 3 code isolated in phase-3/ directory; existing Phase 2 backend and frontend unchanged

### Principle III: Clear Exit Criteria ✅
- **Plan Exit Criteria**: MCP server architecture defined; AI agent design specified; LLM provider chosen; no backend modifications confirmed; user approval obtained
- **Implementation Exit Criteria**: Natural language commands work; MCP tools call backend correctly; no hallucinations; chat UI integrated; app runs locally

### Principle IV: Domain Consistency ✅
- **Phase 1 & 2 Rules MAINTAINED**: No changes to todo entity, status transitions, title validation, user isolation, ownership checks
- **Phase 2 Backend UNCHANGED**: All REST APIs remain exactly as implemented in Phase 2
- **Phase 2 Database UNCHANGED**: No schema modifications, no new tables
- **Phase 3 AI Rules** (NEW, isolated):
  - Intent classification (CREATE, LIST, COMPLETE, UPDATE, DELETE, CLARIFY, UNKNOWN)
  - MCP-only interaction (no direct backend or DB access)
  - No conversation memory (stateless)
  - Fuzzy title matching for natural language
- **Terminology**: Existing terms preserved; new terms: "intent", "MCP tool", "natural language command"

### Principle V: Stateless Services ✅
- **AI Agent Stateless**: No conversation history stored on server
- **Each Command Independent**: AI fetches fresh data from backend via MCP tools
- **No Session State**: User context from JWT only (same as Phase 2)
- **Database as Source of Truth**: All todo data remains in Neon PostgreSQL; AI has no cache

### Principle VI: MCP Tool Constraint ✅ (CRITICAL for Phase 3)
- **AI Agent Uses MCP Tools EXCLUSIVELY**: Cannot call backend APIs directly, cannot query database directly
- **MCP Server Implementation**: 5 tools wrapping Phase 2 REST endpoints
- **JWT Passing**: Every MCP tool receives and forwards JWT to backend
- **No Bypass**: MCP server is the ONLY way AI interacts with todo data
- **Auditable**: All AI actions traceable through MCP tool invocations

### Principle VII: Cloud-Native Readiness ⚠️
- **Phase 3 Scope**: Local development (MCP server runs locally)
- **Deferred to Phase 4**: Docker, Kubernetes, cloud deployment
- **Environment Variables**: MCP server config (BACKEND_URL, MCP_PORT, LLM_API_KEY)
- **Justification**: Phase 3 establishes AI integration; containerization deferred

### Principle VIII: Process Over Features ✅
- Simple intent recognition (7 intents, keyword-based)
- No advanced NLP (no sentiment, no entity extraction beyond todo params)
- No multi-turn conversations (each command independent)
- No proactive suggestions (respond only to user commands)
- No model training or fine-tuning

### Principle IX: Phase-Based Folder Organization ✅
- All Phase 3 files MUST reside in `phase-3/` directory
- MCP server in `phase-3/mcp-server/`
- AI agent in `phase-3/ai-agent/` (if separate from MCP server)
- Frontend chat component in `phase-3/frontend-additions/` (then copied to phase-2/frontend)

**Constitution Check Result**: ✅ PASS (with justified Phase 4 deferral for Principle VII; emphasis on Principle VI for MCP tools)

## Project Structure

### Documentation (this feature)

```text
specs/003-ai-todo-chatbot/
├── spec.md              # Feature specification (COMPLETE)
├── plan.md              # This file (IN PROGRESS)
└── tasks.md             # Task breakdown (PENDING - created by /sp.tasks)
```

### Source Code (repository root)

```text
phase-3/                 # All Phase 3 implementation files
├── mcp-server/          # MCP server wrapping Phase 2 APIs
│   ├── server.py        # FastMCP server with 5 tool definitions
│   ├── tools/           # MCP tool implementations
│   │   ├── create.py    # create_todo tool
│   │   ├── list.py      # list_todos tool
│   │   ├── complete.py  # complete_todo tool
│   │   ├── update.py    # update_todo tool
│   │   └── delete.py    # delete_todo tool
│   ├── requirements.txt # MCP server dependencies
│   └── .env.example     # MCP server config
├── frontend-additions/  # Chat component to add to Phase 2 frontend
│   ├── ChatPanel.tsx    # Chat UI component
│   └── chat.tsx         # Chat page (optional)
├── README.md            # Phase 3 documentation
└── .env.example         # Shared environment template
```

**Structure Decision**: Phase 3 adds isolated AI layer:
1. **No Backend Changes**: Phase 2 backend (`phase-2/backend/`) completely untouched
2. **Minimal Frontend Changes**: Add chat component to Phase 2 frontend
3. **MCP Server Isolation**: Separate server that proxies Phase 2 APIs as tools
4. **Phase Isolation**: All new code in phase-3/ directory (Principle IX)

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A       | N/A        | N/A                                 |

## Design Decisions

### 1. MCP Server Architecture: FastMCP with Tool Wrappers

**Decision**: Use FastMCP Python library to build MCP server with 5 tool definitions that wrap Phase 2 REST endpoints.

**Rationale**:
- **Simplicity**: FastMCP provides decorator-based tool definition
- **Constitution Compliance**: Enforces Principle VI (MCP-only AI interaction)
- **No Backend Changes**: MCP server is separate process; Phase 2 backend untouched
- **Stateless**: Each tool call is independent HTTP request to backend
- **Auditable**: Tool invocations logged and traceable

**Implementation**:
```python
# server.py using FastMCP
from fastmcp import FastMCP
import requests

mcp = FastMCP("Todo API Tools")

@mcp.tool()
def create_todo(title: str, jwt_token: str) -> dict:
    """Create a new todo."""
    response = requests.post(
        f"{BACKEND_URL}/api/todos",
        json={"title": title},
        headers={"Authorization": f"Bearer {jwt_token}"}
    )
    return response.json()
```

**Alternatives Considered**:
- Modify Phase 2 backend to include MCP endpoints: Rejected (violates "no backend changes" constraint)
- Direct AI-to-backend calls: Rejected (violates Principle VI MCP constraint)
- Server-side tool routing without MCP: Rejected (not MCP-compliant)

### 2. AI Agent: Claude API with System Prompt

**Decision**: Use Anthropic Claude API (claude-3-sonnet or claude-3-haiku) with structured system prompt for intent classification.

**Rationale**:
- **Intent Recognition**: Claude excels at instruction following and classification
- **Tool Use**: Native support for tool/function calling
- **Safety**: Can be prompted to refuse hallucinations and request clarification
- **Stateless**: Each API call independent (no conversation memory needed)
- **Cost-Effective**: Haiku for simple commands, Sonnet for complex intent recognition

**System Prompt Structure**:
```
You are a todo management assistant. You can:
- CREATE todos: "add [task]", "create [task]", "remind me to [task]"
- LIST todos: "list", "show my todos", "what do I need to do"
- COMPLETE todos: "complete [task/id]", "mark [task] as done"
- UPDATE todos: "update [task] to [new title]", "change [task] to [new title]"
- DELETE todos: "delete [task/id]", "remove [task]"

Rules:
- NEVER hallucinate todo IDs or titles
- ALWAYS fetch current data from backend via tools
- Request clarification if command is ambiguous
- Use fuzzy matching for task titles (case-insensitive, partial matches)
```

**Alternatives Considered**:
- GPT-4: Rejected (Claude better instruction following; cost)
- Local LLM (Ollama): Rejected (quality inconsistent; slow on CPU)
- Fine-tuned model: Rejected (spec non-goal: no training)

### 3. Frontend Integration: Chat Panel Component

**Decision**: Add ChatPanel.tsx component to Phase 2 frontend; integrate on /todos page as collapsible panel.

**Rationale**:
- **Minimal Changes**: Single component addition; no redesign
- **User Context**: Chat on same page as todo list (user sees results immediately)
- **JWT Reuse**: Use existing authentication (same JWT from localStorage)
- **Optional**: Users can still use traditional UI (buttons) or chat

**Chat Panel UI**:
- Collapsible panel on right side of /todos page
- Message history (user messages + AI responses)
- Text input for natural language commands
- Example commands displayed initially
- Basic styling (matches Phase 2 simplicity)

**Alternatives Considered**:
- Separate /chat page: Rejected (worse UX; user can't see todo list while chatting)
- Replace existing UI: Rejected (violates "no frontend redesign" constraint)
- Modal/popup: Rejected (less space for conversation)

### 4. Intent Classification: Keyword Matching + LLM Validation

**Decision**: Use LLM to classify user intent into one of 7 categories based on keywords and context.

**Intent Mapping**:
- **CREATE**: add, create, new, remind, need to → extract title after keyword
- **LIST**: list, show, display, what, view → optional status filter
- **COMPLETE**: complete, finish, done, mark → extract todo title/ID
- **UPDATE**: update, change, rename, edit → extract old title/ID and new title
- **DELETE**: delete, remove, get rid → extract todo title/ID
- **CLARIFY**: Ambiguous or multi-match → request user clarification
- **UNKNOWN**: No todo-related intent → provide help examples

**Parameter Extraction**:
- Todo title: Text after "add", "create", "remind me to"
- Todo ID: Number after "task", "todo #", "#"
- Filter: "pending", "completed", "done", "active"
- Old/new titles for UPDATE: "change X to Y", "update X to Y"

**Rationale**:
- **Deterministic**: Same input → same intent classification
- **Simple**: 7 intents cover all Phase 2 CRUD operations
- **Extensible**: Can add intents in future phases
- **Safe**: UNKNOWN and CLARIFY prevent incorrect actions

**Alternatives Considered**:
- Regex-only parsing: Rejected (too brittle for natural language variations)
- Complex NLU pipeline: Rejected (overengineering; spec says "avoid scope creep")
- Multi-turn conversations: Rejected (violates stateless principle)

### 5. MCP Tool Safety: JWT Validation + Backend Error Pass-Through

**Decision**: Every MCP tool validates JWT presence and forwards all backend responses (including errors) to AI agent.

**Safety Checks**:
1. **JWT Required**: Tool returns error if jwt_token parameter missing
2. **Backend as Authority**: Tool passes backend response as-is (200, 401, 403, 404, 500)
3. **No Caching**: Tool fetches fresh data every call
4. **No Hallucination**: Tool returns exactly what backend returns (no invented data)

**Error Handling**:
- 401 Unauthorized → AI tells user "Please login again"
- 403 Forbidden → AI tells user "Todo not found or not accessible"
- 404 Not Found → AI tells user "No todo found with that ID/title"
- 500 Server Error → AI tells user "Service error, please try again"

**Rationale**:
- **Security**: JWT validation maintains authentication boundary
- **Trust**: Backend owns authorization and business logic
- **Transparency**: Errors propagate to user (no silent failures)
- **Stateless**: No session state in MCP server

**Alternatives Considered**:
- MCP server validates ownership: Rejected (duplicates backend logic; violates single responsibility)
- Cache backend responses: Rejected (violates stateless principle and "fresh data" requirement)

### 6. Fuzzy Title Matching: Case-Insensitive Partial Match

**Decision**: When user refers to todo by title (not ID), AI fetches all todos via list_todos tool and performs fuzzy matching.

**Matching Algorithm**:
```python
def fuzzy_match(user_input: str, todos: list) -> list:
    """Find todos matching user's description."""
    user_lower = user_input.lower().strip()
    matches = []
    for todo in todos:
        title_lower = todo["title"].lower()
        if user_lower in title_lower or title_lower in user_lower:
            matches.append(todo)
    return matches
```

**Handling Multiple Matches**:
- 0 matches: "No todo found matching '[input]'"
- 1 match: Proceed with operation (complete/update/delete)
- 2+ matches: "Multiple todos match. Please specify: [list todo IDs and titles]"

**Rationale**:
- **User-Friendly**: "complete groceries" matches "buy groceries from store"
- **Safe**: Requests clarification for ambiguity (no guessing)
- **Simple**: Basic string matching sufficient for Phase 3
- **No Hallucinations**: Only matches against actual todos from backend

**Alternatives Considered**:
- Exact title match only: Rejected (poor UX; users type abbreviations)
- Semantic similarity (embeddings): Rejected (overengineering for Phase 3)
- Always require ID: Rejected (defeats purpose of natural language)

## Implementation Strategy

### Minimal Viable Approach

Per constitution Principle VIII and user requirement "avoid scope creep":

**MCP Server**:
- Single server.py file using FastMCP
- 5 tool functions (create, list, complete, update, delete)
- Requests library for HTTP calls to Phase 2 backend
- No database access, no business logic (pure proxy)

**AI Agent**:
- Can be integrated into MCP server or separate endpoint
- Claude API with structured system prompt
- Simple intent classification (keyword-based with LLM validation)
- Tool invocation with extracted parameters
- No conversation history, no context window management

**Frontend**:
- Single ChatPanel.tsx component (~100 lines)
- Add to existing /todos page from Phase 2
- Calls AI agent endpoint with user message and JWT
- Displays responses in chat format
- No redesign of existing UI

**No Training, No Models**: Use Claude API as-is (no fine-tuning)

### Verification Strategy

Per user requirement "ensure each step is verifiable":

**MCP Server Verification**:
- After tool definition: Test with MCP inspector or direct tool call
- After each tool: Use curl to backend, verify MCP tool produces same result
- Example: `mcp call create_todo '{"title": "test", "jwt_token": "..."}'`

**AI Agent Verification**:
- After intent classification: Test with sample commands, verify correct intent extracted
- Example: "add buy milk" → CREATE intent, title="buy milk"
- After tool invocation: Verify AI calls correct MCP tool with correct params
- Example: CREATE intent → calls create_todo MCP tool

**Frontend Verification**:
- After ChatPanel component: Render in isolation, verify UI displays
- After integration: Type natural language command, verify backend API called
- After error handling: Test with expired JWT, verify redirect to login

**Integration Verification**:
- Type "add buy groceries" → Verify todo created in database
- Type "list todos" → Verify displays actual todos from backend
- Type "complete buy groceries" → Verify status changes in database

## Dependencies & Build

### MCP Server Dependencies (requirements.txt)

```
fastmcp==0.3.0
requests==2.31.0
python-dotenv==1.0.1
anthropic==0.39.0  # or openai==1.0.0 if using GPT
```

**Rationale**:
- fastmcp: Simplified MCP server creation
- requests: HTTP calls to Phase 2 backend
- python-dotenv: Environment variable loading
- anthropic: Claude API client (or openai for GPT)

### Frontend - No New Dependencies

**Phase 2 Next.js stack sufficient**:
- ChatPanel component uses existing React
- Fetch API for calling AI agent endpoint
- No new libraries needed

### Build & Run Commands

**Phase 2 Backend** (unchanged):
```bash
cd phase-2/backend
uvicorn main:app --reload --port 8000
```

**Phase 2 Frontend** (with chat component added):
```bash
cd phase-2/frontend
npm run dev  # Port 3000
```

**Phase 3 MCP Server** (new):
```bash
cd phase-3/mcp-server
pip install -r requirements.txt
python server.py  # Port 5000
```

**Environment Variables**:
```bash
# Phase 3 MCP Server .env
BACKEND_URL=http://localhost:8000
MCP_PORT=5000
ANTHROPIC_API_KEY=your-claude-api-key  # or OPENAI_API_KEY
LLM_MODEL=claude-3-haiku-20240307  # or gpt-4
```

## Risks & Mitigations

### Risk 1: AI Hallucinations (Inventing Todos)
**Impact**: Critical - creates fake data, breaks user trust
**Likelihood**: Medium (LLMs can hallucinate)
**Mitigation**: System prompt explicitly forbids hallucinations; AI only returns data from MCP tool responses; no caching
**Testing**: Create user with 3 todos, ask "list todos", verify AI lists exactly 3 (no invented ones)

### Risk 2: MCP Tool Bypassing Authentication
**Impact**: Critical - security vulnerability
**Likelihood**: Low (if implemented correctly)
**Mitigation**: Every tool validates jwt_token parameter; no default or fallback tokens; tool returns 401 if token missing
**Testing**: Call MCP tool without jwt_token, verify error returned

### Risk 3: Ambiguous Commands Causing Wrong Actions
**Impact**: High - user says "finish the task", AI completes wrong todo
**Likelihood**: Medium (natural language is ambiguous)
**Mitigation**: Fuzzy matching finds multiple matches → AI requests clarification; never guess
**Testing**: Add 2 todos with "review" in title, say "complete review", verify AI asks which one

### Risk 4: Backend Errors Not Explained to User
**Impact**: Medium - poor UX
**Likelihood**: Medium (backend can return errors)
**Mitigation**: AI interprets backend errors and explains in user-friendly terms (401 → "login again", 403 → "not found")
**Testing**: Expire JWT, type command, verify AI says "Please login again" (not raw 401 error)

### Risk 5: LLM API Rate Limiting or Costs
**Impact**: Low - service degradation
**Likelihood**: Low for local dev
**Mitigation**: Use Haiku model (cheaper, faster); implement retry with exponential backoff
**Acceptance**: Phase 3 is local dev; production rate limiting deferred to Phase 4

## Plan Completeness Checklist

- ✅ Technical context fully specified (Python MCP server, FastMCP, Claude API, minimal frontend changes)
- ✅ Constitution Check passed for all 9 principles (emphasis on Principle VI MCP tools)
- ✅ Project structure defined (phase-3/mcp-server/, frontend-additions/)
- ✅ Design decisions documented with rationale (MCP architecture, AI agent, frontend integration, intent classification, MCP safety, fuzzy matching)
- ✅ No backend modifications confirmed (Phase 2 backend completely untouched)
- ✅ Dependencies listed (MCP server requirements.txt; no new frontend deps)
- ✅ Build and run commands documented (3 servers: backend 8000, frontend 3000, MCP 5000)
- ✅ Environment variables specified (BACKEND_URL, MCP_PORT, ANTHROPIC_API_KEY)
- ✅ Verification strategy for incremental development
- ✅ Risks identified with mitigations (5 AI-specific risks analyzed)
- ✅ No placeholders or "NEEDS CLARIFICATION" markers
- ✅ No scope expansion beyond spec (no training, no multi-turn, no advanced NLP)
- ✅ All decisions traceable to spec requirements

**Status**: Ready for Task Definition Phase (Phase 3 per constitution workflow)

**Next Step**: Run `/sp.tasks` to generate actionable task breakdown with file paths, dependencies, and verification steps organized by user story.
