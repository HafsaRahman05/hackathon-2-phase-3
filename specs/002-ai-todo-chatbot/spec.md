# Feature Specification: AI-Driven Todo Chatbot

**Feature Branch**: `003-ai-todo-chatbot`
**Created**: 2025-12-30
**Status**: Draft
**Input**: User description: "Create Phase 3 specification for Hackathon 2: AI-driven Todo Chatbot. Scope: AI chatbot interface for Todo management, Natural language commands (add, update, delete, complete, list), Intent recognition and safe action mapping, Use MCP tools to call existing backend APIs, Server remains stateless, Database remains the only source of truth. Constraints: Follow the project constitution strictly, No changes to existing backend APIs, No frontend redesign; minimal UI changes only, Deterministic tool invocation (no hallucinated actions), Clear error handling for ambiguous commands. Non-Goals: No training or fine-tuning, No memory outside database, No deployment or Kubernetes, No Kafka or Dapr. Exit Criteria: User can manage todos via natural language, AI correctly maps intents to backend API calls, No unauthorized or unsafe actions, App runs locally without errors."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Natural Language Todo Creation (Priority: P1) 🎯 MVP

As a logged-in user, I want to create todos using natural language commands so that I can quickly add tasks without filling forms.

**Why this priority**: This is the core value proposition of an AI chatbot - converting natural language to structured actions. Without this, there's no chatbot functionality.

**Independent Test**: Can be fully tested by typing "add task to buy groceries", verifying AI calls POST /api/todos with title "buy groceries", and todo appears in list. Delivers natural language task creation.

**Acceptance Scenarios**:

1. **Given** a logged-in user types "add buy groceries", **When** AI processes the command, **Then** AI calls POST /api/todos with title "buy groceries" and confirms "Added: buy groceries"
2. **Given** a logged-in user types "create a task to review pull requests", **When** AI processes the command, **Then** AI extracts "review pull requests" as title and creates todo
3. **Given** a logged-in user types "remind me to call mom", **When** AI processes the command, **Then** AI creates todo with title "call mom"
4. **Given** a logged-in user types "add" (incomplete command), **When** AI processes the command, **Then** AI responds "What would you like to add?" (clarification request)
5. **Given** a logged-in user types random text with no intent, **When** AI processes the command, **Then** AI responds "I can help you manage todos. Try 'add [task]' or 'list todos'"

---

### User Story 2 - Natural Language Todo Listing (Priority: P2)

As a logged-in user, I want to view my todos using natural language so that I can check my tasks conversationally.

**Why this priority**: After creation, listing is the most common operation. Users need to see what tasks they have.

**Independent Test**: Can be tested by typing "show my todos" or "list tasks", verifying AI calls GET /api/todos, and displays results in readable format. Delivers conversational task viewing.

**Acceptance Scenarios**:

1. **Given** a logged-in user types "list my todos", **When** AI processes the command, **Then** AI calls GET /api/todos and displays all todos with status
2. **Given** a logged-in user types "show me my tasks", **When** AI processes the command, **Then** AI lists all todos in readable format
3. **Given** a logged-in user types "what do I need to do?", **When** AI processes the command, **Then** AI lists pending todos only
4. **Given** a logged-in user has no todos and types "list todos", **When** AI processes the command, **Then** AI responds "You have no todos. Would you like to create one?"
5. **Given** a logged-in user types "show pending" or "show completed", **When** AI processes the command, **Then** AI filters and displays todos by status

---

### User Story 3 - Natural Language Todo Completion (Priority: P3)

As a logged-in user, I want to mark todos as completed using natural language so that I can update task status conversationally.

**Why this priority**: Completing tasks is a frequent operation. Natural language makes it faster than clicking buttons.

**Independent Test**: Can be tested by typing "complete buy groceries", verifying AI finds todo by title, calls PATCH /api/todos/{id}/complete, and confirms completion. Delivers conversational status updates.

**Acceptance Scenarios**:

1. **Given** a logged-in user has a pending todo "buy groceries" and types "complete buy groceries", **When** AI processes the command, **Then** AI finds todo by title match, calls complete endpoint, and confirms "Marked 'buy groceries' as completed"
2. **Given** a logged-in user types "mark task 5 as done", **When** AI processes the command, **Then** AI calls PATCH /api/todos/5/complete
3. **Given** a logged-in user types "finish the code review task", **When** AI processes the command, **Then** AI searches for todo with title containing "code review" and completes it
4. **Given** multiple todos match the user's description, **When** AI processes the command, **Then** AI responds "Multiple todos match. Please be more specific: [list matches]"
5. **Given** no todos match the user's description, **When** AI processes the command, **Then** AI responds "No todo found matching '[description]'"

---

### User Story 4 - Natural Language Todo Update (Priority: P4)

As a logged-in user, I want to update todo titles using natural language so that I can refine tasks conversationally.

**Why this priority**: Editing is less frequent than creating or completing, making this lower priority.

**Independent Test**: Can be tested by typing "change 'buy milk' to 'buy almond milk'", verifying AI finds todo, calls PATCH /api/todos/{id} with new title, and confirms update. Delivers conversational task editing.

**Acceptance Scenarios**:

1. **Given** a logged-in user has todo "buy milk" and types "update buy milk to buy almond milk", **When** AI processes the command, **Then** AI finds todo by title, calls update endpoint with new title, and confirms "Updated: buy milk → buy almond milk"
2. **Given** a logged-in user types "rename task 3 to review security audit", **When** AI processes the command, **Then** AI calls PATCH /api/todos/3 with title "review security audit"
3. **Given** a logged-in user types "change the groceries task to buy organic groceries", **When** AI processes the command, **Then** AI finds todo with "groceries" in title and updates it
4. **Given** the user's command is ambiguous (multiple matches), **When** AI processes the command, **Then** AI asks "Which todo? [list matches]"

---

### User Story 5 - Natural Language Todo Deletion (Priority: P5)

As a logged-in user, I want to delete todos using natural language so that I can remove tasks conversationally.

**Why this priority**: Deletion is the least frequent operation, making this lowest priority.

**Independent Test**: Can be tested by typing "delete buy groceries", verifying AI finds todo, calls DELETE /api/todos/{id}, and confirms deletion. Delivers conversational task removal.

**Acceptance Scenarios**:

1. **Given** a logged-in user has todo "buy groceries" and types "delete buy groceries", **When** AI processes the command, **Then** AI finds todo by title, calls DELETE endpoint, and confirms "Deleted: buy groceries"
2. **Given** a logged-in user types "remove task 7", **When** AI processes the command, **Then** AI calls DELETE /api/todos/7
3. **Given** a logged-in user types "get rid of the completed tasks", **When** AI processes the command, **Then** AI responds "This would delete [N] todos. Confirm? (yes/no)" (safety check for bulk operations)
4. **Given** no todo matches the deletion request, **When** AI processes the command, **Then** AI responds "No todo found to delete"

---

### Edge Cases

- What happens when user types ambiguous command like "fix the bug"? **AI responds "I don't understand. Would you like to add a todo 'fix the bug'?"**
- What happens when user asks non-todo questions like "what's the weather"? **AI responds "I can only help with todo management. Try 'add [task]', 'list todos', etc."**
- What happens when AI cannot extract a valid intent? **AI responds with helpful examples of supported commands**
- What happens when user tries to complete/update/delete another user's todo via natural language? **AI uses same JWT authentication; backend returns 403; AI reports "Todo not found or not accessible"**
- What happens when user types command with typos like "ad buy milk"? **AI interprets "ad" as "add" (fuzzy matching) and creates todo**
- What happens when JWT token expires during chat? **AI receives 401 from backend, prompts user to login again**
- What happens when backend is down? **AI receives connection error, responds "Unable to connect to todo service. Please try again."**
- What happens when user types very long command (1000+ chars)? **AI processes normally; only extracts relevant task title (max 500 chars per domain rule)**

## Requirements *(mandatory)*

### Functional Requirements

#### AI Chatbot Interface
- **FR-001**: System MUST provide a chat interface in frontend (text input + message history)
- **FR-002**: System MUST send user messages to AI agent for intent recognition
- **FR-003**: AI agent MUST classify user intent into one of: CREATE, LIST, COMPLETE, UPDATE, DELETE, CLARIFY, UNKNOWN
- **FR-004**: AI agent MUST extract relevant parameters from natural language (e.g., todo title, todo ID, filter criteria)
- **FR-005**: AI agent MUST handle ambiguous commands by requesting clarification
- **FR-006**: AI agent MUST provide helpful suggestions when intent is unclear
- **FR-007**: Chat interface MUST display both user messages and AI responses in conversation format

#### MCP Tool Integration
- **FR-008**: AI agent MUST use MCP tools to call backend REST APIs (not direct HTTP calls)
- **FR-009**: AI agent MUST include JWT token from user session when calling todo APIs
- **FR-010**: AI agent MUST use POST /api/todos MCP tool for CREATE intent
- **FR-011**: AI agent MUST use GET /api/todos MCP tool for LIST intent
- **FR-012**: AI agent MUST use PATCH /api/todos/{id}/complete MCP tool for COMPLETE intent
- **FR-013**: AI agent MUST use PATCH /api/todos/{id} MCP tool for UPDATE intent
- **FR-014**: AI agent MUST use DELETE /api/todos/{id} MCP tool for DELETE intent
- **FR-015**: MCP tools MUST pass JWT token in Authorization header (maintain authentication)

#### Intent Recognition & Safety
- **FR-016**: AI MUST NOT hallucinate todo IDs or titles (only use data from backend responses)
- **FR-017**: AI MUST NOT perform actions without user confirmation for bulk operations (e.g., "delete all completed")
- **FR-018**: AI MUST handle fuzzy matching for todo titles (e.g., "buy milk" matches "Buy milk from store")
- **FR-019**: AI MUST request clarification when multiple todos match user's description
- **FR-020**: AI MUST validate extracted parameters before calling MCP tools (e.g., non-empty title)
- **FR-021**: AI MUST handle backend errors gracefully and explain them to user (401 → "Please login", 403 → "Todo not found", 404 → "Todo doesn't exist")

#### Stateless & Database Integrity
- **FR-022**: AI agent MUST NOT store conversation history in server memory (stateless per Principle V)
- **FR-023**: AI agent MUST fetch fresh data from database via MCP tools for every query (no caching)
- **FR-024**: AI responses MUST be based on current database state only
- **FR-025**: All todo data MUST remain in database (no AI-side storage)

#### Frontend Integration
- **FR-026**: Frontend MUST add a chat panel or page (/chat) for AI interaction
- **FR-027**: Chat interface MUST send user messages to AI agent endpoint
- **FR-028**: Chat interface MUST display AI responses with proper formatting
- **FR-029**: Chat interface MUST maintain JWT authentication (same as existing pages)
- **FR-030**: Chat interface MUST provide example commands to guide users

### Key Entities

#### ChatMessage (frontend only, not persisted)
- **role** (string): "user" or "assistant"
- **content** (string): Message text
- **timestamp** (datetime): When message was sent

#### AIIntent (AI agent internal, not persisted)
- **intent** (enum): CREATE, LIST, COMPLETE, UPDATE, DELETE, CLARIFY, UNKNOWN
- **parameters** (object): Extracted data (title, id, filter, etc.)
- **confidence** (float): 0.0-1.0, request clarification if < 0.7

### Domain Rules (Constitution Principle IV)

**Phase 1 & 2 Rules MUST Be Maintained**:
- Todo status transitions: pending → completed (no reverse)
- Todo title validation: non-empty, max 500 chars
- User data isolation: user_id filtering via JWT
- Ownership checks: 403 if not owner
- All existing domain rules preserved

**AI Agent Rules** (NEW for Phase 3):
- AI MUST NOT create, modify, or delete todos without user intent
- AI MUST NOT access database directly (only via MCP tools calling backend APIs)
- AI MUST NOT store conversation history in database or memory
- AI MUST validate all extracted parameters before MCP tool invocation
- AI MUST handle ambiguity with clarification requests (never guess)
- AI MUST respect backend error responses (401, 403, 404) and explain to user
- AI MUST use fuzzy matching for title searches (case-insensitive, partial matches)

**MCP Tool Constraint Rules** (Principle VI enforced):
- AI MUST ONLY interact with backend through MCP tools
- MCP tools MUST wrap existing REST API endpoints (no new backend code)
- Each MCP tool MUST pass JWT token for authentication
- MCP tools MUST NOT bypass backend validation or authorization
- No direct database queries from AI (only via backend APIs)

**Intent Classification Rules**:
- CREATE: Keywords like "add", "create", "new", "remind me", "need to"
- LIST: Keywords like "list", "show", "what", "display", "my todos"
- COMPLETE: Keywords like "complete", "finish", "done", "mark as done"
- UPDATE: Keywords like "update", "change", "rename", "edit"
- DELETE: Keywords like "delete", "remove", "get rid of"
- CLARIFY: Ambiguous commands with multiple interpretations
- UNKNOWN: Commands outside todo management scope

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: User can type "add buy groceries" and todo is created via AI agent
- **SC-002**: User can type "list my todos" and AI displays current todos from database
- **SC-003**: User can type "complete buy groceries" and AI marks the todo as completed
- **SC-004**: User can type "update buy milk to buy almond milk" and AI updates the title
- **SC-005**: User can type "delete the groceries task" and AI removes the todo
- **SC-006**: AI correctly identifies ambiguous commands and requests clarification (accuracy > 90%)
- **SC-007**: AI never creates hallucinated todos (all todos created are from user commands only)
- **SC-008**: AI respects authentication - cannot access other users' todos via natural language
- **SC-009**: AI handles backend errors gracefully (401, 403, 404) with user-friendly explanations
- **SC-010**: Chat interface runs without errors and integrates with existing Phase 2 UI

## Constraints

### Technical Constraints
- **MUST** use MCP tools to call Phase 2 backend APIs
- **MUST** maintain existing FastAPI backend without modifications
- **MUST** use LLM (e.g., Claude, GPT) for intent recognition
- **MUST** implement MCP server for todo API tool definitions
- **MUST** keep frontend changes minimal (add chat component/page only)
- **MUST** maintain JWT authentication for all operations
- **MUST NOT** store conversation history in database or server memory
- **MUST NOT** train or fine-tune models

### Constitution Compliance
- **Principle I (Spec-First)**: This spec MUST be complete and approved before planning begins
- **Principle II (Phase Discipline)**: Specification → Planning → Tasks → Implementation → Validation
- **Principle III (Exit Criteria)**: All acceptance scenarios MUST be testable
- **Principle IV (Domain Consistency)**: Phase 1 & 2 todo rules MUST be maintained; no changes to existing domain model
- **Principle V (Stateless Services)**: AI agent MUST be stateless; no conversation memory on server; database as only source of truth
- **Principle VI (MCP Tools)**: AI agent MUST use MCP tools exclusively for backend communication (NON-NEGOTIABLE)
- **Principle VII (Cloud-Native)**: Phase 3 focuses on AI integration; Docker/Kubernetes deferred to future phases
- **Principle VIII (Process Over Features)**: Simple intent recognition; no advanced NLP; no multi-turn conversations
- **Principle IX (Folder Organization)**: All Phase 3 files MUST reside in `phase-3/` directory

### Safety & Determinism Constraints
- **No Hallucinations**: AI cannot invent todo IDs, titles, or user data
- **No Unauthorized Actions**: AI cannot bypass authentication or ownership checks
- **Deterministic Mapping**: Same natural language input → same MCP tool call
- **Safe Defaults**: Unclear commands result in clarification, not guessed actions
- **Backend as Authority**: AI trusts backend responses (404 = not found, 403 = not authorized)

## Out of Scope (Non-Goals)

### Explicitly Excluded from Phase 3
- **No Model Training**: No fine-tuning, no custom model training
- **No Conversation Memory**: No chat history persistence (stateless per Principle V)
- **No Multi-Turn Context**: Each command treated independently (no "remember what I said earlier")
- **No Deployment**: No Docker, no Kubernetes (Phase 3 is local development)
- **No Event Streaming**: No Kafka, no Dapr (not needed for Phase 3 scope)
- **No Advanced NLP**: No sentiment analysis, no entity extraction beyond todo parameters
- **No Voice Interface**: Text-only chatbot
- **No Backend Changes**: Existing REST APIs remain unchanged
- **No Database Schema Changes**: No new tables or columns
- **No Frontend Redesign**: Minimal UI changes (add chat panel only)
- **No Proactive Suggestions**: AI responds only to user commands (no "you should do X")
- **No Todo Prioritization**: AI doesn't rank or suggest which todos to do first
- **No Natural Language Queries**: No complex queries like "show todos from last week" (simple list/filter only)

### Future Phases (Not Phase 3)
- **Phase 4 (potential)**: Docker and Kubernetes deployment
- **Phase 5 (potential)**: Advanced NLP features, multi-turn conversations, proactive suggestions

## MCP Tool Specification

### MCP Server: todo-api

**Purpose**: Expose Phase 2 backend REST APIs as MCP tools for AI agent consumption

### Tool Definitions

#### create_todo
**Description**: Create a new todo for the authenticated user
**Input**:
```json
{
  "title": "string (required, 1-500 chars)",
  "jwt_token": "string (required)"
}
```
**Action**: Calls POST /api/todos with Authorization header
**Returns**: Created todo object (id, user_id, title, status, created_at)

#### list_todos
**Description**: List all todos for the authenticated user
**Input**:
```json
{
  "jwt_token": "string (required)",
  "status_filter": "string (optional: 'pending' or 'completed')"
}
```
**Action**: Calls GET /api/todos with Authorization header
**Returns**: Array of todo objects

#### complete_todo
**Description**: Mark a todo as completed
**Input**:
```json
{
  "todo_id": "integer (required)",
  "jwt_token": "string (required)"
}
```
**Action**: Calls PATCH /api/todos/{id}/complete with Authorization header
**Returns**: Updated todo object

#### update_todo
**Description**: Update a todo's title
**Input**:
```json
{
  "todo_id": "integer (required)",
  "new_title": "string (required, 1-500 chars)",
  "jwt_token": "string (required)"
}
```
**Action**: Calls PATCH /api/todos/{id} with Authorization header
**Returns**: Updated todo object

#### delete_todo
**Description**: Delete a todo
**Input**:
```json
{
  "todo_id": "integer (required)",
  "jwt_token": "string (required)"
}
```
**Action**: Calls DELETE /api/todos/{id} with Authorization header
**Returns**: Success confirmation

### MCP Tool Safety

- All tools MUST validate jwt_token parameter
- All tools MUST include Authorization header when calling backend
- All tools MUST return backend errors as-is (401, 403, 404) for AI to interpret
- All tools MUST NOT cache responses (fetch fresh data every time)

## Specification Completeness Checklist

- ✅ All user stories have priority assignments (P1-P5)
- ✅ All user stories are independently testable
- ✅ All user stories have acceptance scenarios in Given/When/Then format
- ✅ All edge cases identified and documented
- ✅ All functional requirements numbered and testable (FR-001 to FR-030)
- ✅ All key entities defined (ChatMessage, AIIntent)
- ✅ All domain rules explicitly stated (maintain Phase 1 & 2 rules + new AI rules)
- ✅ Domain consistency maintained from Phase 1 & 2
- ✅ MCP tool specifications complete with input/output schemas
- ✅ All success criteria measurable and technology-agnostic (SC-001 to SC-010)
- ✅ All constraints documented (technical, constitutional, safety, determinism)
- ✅ All non-goals explicitly listed
- ✅ No "NEEDS CLARIFICATION" markers present
- ✅ Constitution principles reviewed and applied (special emphasis on Principles IV, V, VI)

**Status**: Ready for Planning Phase (Phase 2 per constitution workflow)
