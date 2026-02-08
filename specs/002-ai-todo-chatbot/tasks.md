---
description: "Task list for AI-Driven Todo Chatbot (Phase 3)"
---

# Tasks: AI-Driven Todo Chatbot

**Input**: Design documents from `/specs/003-ai-todo-chatbot/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Tests**: Manual acceptance testing with natural language commands

**Organization**: Tasks separated into MCP Server, AI Agent, and Frontend sections, then grouped by user story.

**CRITICAL**: Phase 2 backend and database MUST remain unchanged. All tasks create NEW files in phase-3/ directory only.

## Format: `[ID] [P?] [MCP/AI/FE] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[MCP]**: MCP server task (phase-3/mcp-server/)
- **[AI]**: AI agent task (integrated in MCP server)
- **[FE]**: Frontend task (phase-3/frontend-additions/ then copy to phase-2/frontend/)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4, US5)
- Include exact file paths in descriptions

## Path Conventions

- **MCP Server**: `phase-3/mcp-server/` directory
- **Frontend Additions**: `phase-3/frontend-additions/` (then copy to phase-2/frontend/)
- **NO changes to**: `phase-2/backend/` or database schema

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Create Phase 3 directory structure and configuration

- [ ] T001 Create `phase-3/` directory at repository root
  - **Success**: Directory exists
  - **Verification**: `ls phase-3` shows directory
  - **Requirement**: Constitution Principle IX

- [ ] T002 Create `phase-3/mcp-server/` directory
  - **Success**: MCP server directory exists
  - **Verification**: `ls phase-3/mcp-server` shows directory
  - **Requirement**: Plan structure decision

- [ ] T003 Create `phase-3/mcp-server/tools/` directory
  - **Success**: Tools directory exists for MCP tool implementations
  - **Verification**: `ls phase-3/mcp-server/tools` shows directory
  - **Requirement**: Plan MCP tool organization

- [ ] T004 Create `phase-3/frontend-additions/` directory
  - **Success**: Directory for chat component exists
  - **Verification**: `ls phase-3/frontend-additions` shows directory
  - **Requirement**: Plan frontend integration

- [ ] T005 [MCP] Create `phase-3/mcp-server/requirements.txt` with dependencies
  - **Success**: File contains fastmcp, requests, python-dotenv, anthropic
  - **Verification**: `cat phase-3/mcp-server/requirements.txt` shows all 4 dependencies
  - **Requirement**: Plan dependencies section

- [ ] T006 [MCP] Create `phase-3/mcp-server/.env.example` template
  - **Success**: File contains BACKEND_URL, MCP_PORT, ANTHROPIC_API_KEY, LLM_MODEL
  - **Verification**: `cat phase-3/mcp-server/.env.example` shows all variables
  - **Requirement**: Plan environment variables

**Checkpoint**: Phase 3 folder structure created; configuration templates ready

---

## Phase 2: MCP Server Foundational (Tool Infrastructure)

**Purpose**: Core MCP server infrastructure for wrapping Phase 2 APIs

**⚠️ CRITICAL**: This phase establishes MCP tools. AI agent and frontend depend on these tools.

- [ ] T007 [MCP] Create `phase-3/mcp-server/server.py` with FastMCP initialization
  - **Success**: File contains FastMCP server instance, environment loading, server start logic
  - **Verification**: Import in Python, verify no errors; run server, verify starts on port 5000
  - **Requirement**: MCP server foundation

- [ ] T008 [MCP] Add BACKEND_URL configuration to `server.py`
  - **Success**: Load BACKEND_URL from environment, default to http://localhost:8000
  - **Verification**: Check environment variable loaded correctly
  - **Requirement**: MCP tools need backend URL

- [ ] T009 [P] [MCP] [US1] Create `phase-3/mcp-server/tools/create.py` with create_todo tool
  - **Success**: MCP tool that calls POST /api/todos with title and JWT, returns created todo
  - **Verification**: Call tool with test data, verify backend creates todo and tool returns response
  - **Domain Rule**: Title 1-500 chars (validated by backend, not tool)
  - **Requirements**: FR-010 (use MCP tool for CREATE), FR-008 (MCP tool for backend calls)
  - **Acceptance**: Spec User Story 1 infrastructure

- [ ] T010 [P] [MCP] [US2] Create `phase-3/mcp-server/tools/list.py` with list_todos tool
  - **Success**: MCP tool that calls GET /api/todos with JWT and optional status filter, returns todo list
  - **Verification**: Call tool, verify returns actual todos from database
  - **Domain Rule**: Only returns todos for authenticated user (backend enforces)
  - **Requirements**: FR-011 (use MCP tool for LIST)
  - **Acceptance**: Spec User Story 2 infrastructure

- [ ] T011 [P] [MCP] [US3] Create `phase-3/mcp-server/tools/complete.py` with complete_todo tool
  - **Success**: MCP tool that calls PATCH /api/todos/{id}/complete with todo_id and JWT, returns updated todo
  - **Verification**: Create todo, call tool to complete it, verify status="completed"
  - **Domain Rule**: Status transition pending → completed (backend enforces)
  - **Requirements**: FR-012 (use MCP tool for COMPLETE)
  - **Acceptance**: Spec User Story 3 infrastructure

- [ ] T012 [P] [MCP] [US4] Create `phase-3/mcp-server/tools/update.py` with update_todo tool
  - **Success**: MCP tool that calls PATCH /api/todos/{id} with todo_id, new_title, and JWT, returns updated todo
  - **Verification**: Create todo, call tool to update title, verify title changed
  - **Domain Rule**: Title validation (backend enforces)
  - **Requirements**: FR-013 (use MCP tool for UPDATE)
  - **Acceptance**: Spec User Story 4 infrastructure

- [ ] T013 [P] [MCP] [US5] Create `phase-3/mcp-server/tools/delete.py` with delete_todo tool
  - **Success**: MCP tool that calls DELETE /api/todos/{id} with todo_id and JWT, returns success
  - **Verification**: Create todo, call tool to delete it, verify todo removed from database
  - **Requirements**: FR-014 (use MCP tool for DELETE)
  - **Acceptance**: Spec User Story 5 infrastructure

- [ ] T014 [MCP] Register all 5 tools in `server.py`
  - **Success**: All tools (create, list, complete, update, delete) registered with FastMCP server
  - **Verification**: Start MCP server, verify 5 tools available via MCP inspector or tool list endpoint
  - **Requirement**: MCP tool registration

- [ ] T015 [MCP] Add JWT validation to all tools
  - **Success**: Each tool checks jwt_token parameter exists and is non-empty
  - **Verification**: Call tool without jwt_token, verify error returned
  - **Domain Rule**: Authentication required (Principle V - stateless, JWT-based)
  - **Requirements**: FR-015 (MCP tools pass JWT), FR-009 (include JWT)

- [ ] T016 [MCP] Add backend error pass-through to all tools
  - **Success**: Tools return backend HTTP status and error messages without modification
  - **Verification**: Call tool with invalid JWT, verify 401 error passed through; call with wrong todo_id, verify 404 passed through
  - **Safety**: Backend as authority; no error suppression
  - **Requirements**: FR-021 (handle backend errors gracefully)

**Checkpoint**: MCP server foundation ready - All 5 tools implemented, JWT validated, errors pass through

---

## Phase 3: User Story 1 (AI Agent) - Natural Language Todo Creation (Priority: P1)

**Goal**: AI can create todos from natural language commands

**Independent Test**: Type "add buy groceries", verify AI calls create_todo tool and todo appears in database

### AI Agent Implementation for User Story 1

- [ ] T017 [AI] [US1] Add CREATE intent classification to AI agent system prompt
  - **Success**: System prompt defines CREATE intent with keywords (add, create, new, remind, need to)
  - **Verification**: Test AI with "add buy milk", verify classifies as CREATE intent
  - **Requirement**: FR-003 (classify intent)

- [ ] T018 [AI] [US1] Implement title extraction for CREATE intent
  - **Success**: AI extracts title text after keywords (e.g., "add buy groceries" → title="buy groceries")
  - **Verification**: Test with "remind me to call mom", verify extracts "call mom"
  - **Requirement**: FR-004 (extract parameters)
  - **Acceptance**: Spec User Story 1, Scenarios 2, 3

- [ ] T019 [AI] [US1] Implement create_todo MCP tool invocation in AI agent
  - **Success**: When CREATE intent detected, AI calls create_todo tool with extracted title and user's JWT
  - **Verification**: Type "add test task", verify AI calls MCP tool, verify todo created in database
  - **Domain Rule**: MCP tool ONLY (no direct backend calls)
  - **Requirements**: FR-008 (use MCP tools), FR-010 (create via MCP)
  - **Acceptance**: Spec User Story 1, Scenario 1

- [ ] T020 [AI] [US1] Add confirmation response for successful creation
  - **Success**: AI responds "Added: [title]" after successful tool call
  - **Verification**: Create todo, verify confirmation message displayed
  - **Acceptance**: Spec User Story 1, Scenario 1

- [ ] T021 [AI] [US1] Add clarification handling for incomplete CREATE commands
  - **Success**: If title cannot be extracted (e.g., "add"), AI responds "What would you like to add?"
  - **Verification**: Type "add" with no title, verify clarification request
  - **Requirement**: FR-005 (handle ambiguous commands)
  - **Acceptance**: Spec User Story 1, Scenario 4

- [ ] T022 [AI] [US1] Add UNKNOWN intent handling with help suggestions
  - **Success**: For non-todo commands, AI responds with help examples
  - **Verification**: Type "what's the weather", verify AI suggests todo commands
  - **Requirement**: FR-006 (provide suggestions when unclear)
  - **Acceptance**: Spec User Story 1, Scenario 5

**Checkpoint**: User Story 1 complete - AI can create todos from natural language via MCP tools

**Manual Acceptance Test for US1**:
1. Ensure Phase 2 backend and Phase 3 MCP server running
2. Type "add buy groceries" → Verify todo created
3. Type "create a task to review code" → Verify todo created with title "review code"
4. Type "remind me to call mom" → Verify todo created with title "call mom"
5. Type "add" → Verify AI asks "What would you like to add?"
6. Type "hello world" → Verify AI provides help examples

---

## Phase 4: User Story 2 (AI Agent) - Natural Language Todo Listing (Priority: P2)

**Goal**: AI can list todos from natural language commands

**Independent Test**: Type "list my todos", verify AI calls list_todos tool and displays results

### AI Agent Implementation for User Story 2

- [ ] T023 [AI] [US2] Add LIST intent classification to AI agent system prompt
  - **Success**: System prompt defines LIST intent with keywords (list, show, display, what, view)
  - **Verification**: Test AI with "show my tasks", verify classifies as LIST intent
  - **Requirement**: FR-003 (classify intent)

- [ ] T024 [AI] [US2] Implement status filter extraction for LIST intent
  - **Success**: AI extracts status filter (pending/completed) from command if present
  - **Verification**: Test "show pending todos", verify extracts status="pending"
  - **Requirement**: FR-004 (extract parameters)
  - **Acceptance**: Spec User Story 2, Scenario 5

- [ ] T025 [AI] [US2] Implement list_todos MCP tool invocation in AI agent
  - **Success**: When LIST intent detected, AI calls list_todos tool with JWT and optional status filter
  - **Verification**: Type "list my todos", verify AI calls MCP tool, verify returns actual data from database
  - **Domain Rule**: MCP tool ONLY (no direct backend/DB access)
  - **Requirements**: FR-011 (use MCP tool for LIST), FR-023 (fetch fresh data)
  - **Acceptance**: Spec User Story 2, Scenarios 1, 2

- [ ] T026 [AI] [US2] Format todo list in readable text for AI response
  - **Success**: AI formats todos as "1. [title] (pending)" or similar readable format
  - **Verification**: List todos, verify response is human-readable (not raw JSON)
  - **Requirement**: User-friendly display

- [ ] T027 [AI] [US2] Handle empty todo list with helpful message
  - **Success**: If list_todos returns empty array, AI responds "You have no todos. Would you like to create one?"
  - **Verification**: New user with no todos types "list", verify helpful message
  - **Acceptance**: Spec User Story 2, Scenario 4

**Checkpoint**: User Story 2 complete - AI can list todos from natural language via MCP tools

**Manual Acceptance Test for US2**:
1. Add 3 todos via Phase 2 UI (to have test data)
2. Type "list my todos" → Verify all 3 displayed
3. Type "show me my tasks" → Verify all 3 displayed
4. Type "what do I need to do?" → Verify pending todos only
5. Type "show completed" → Verify completed todos only (or none if all pending)

---

## Phase 5: User Story 3 (AI Agent) - Natural Language Todo Completion (Priority: P3)

**Goal**: AI can mark todos as completed from natural language

**Independent Test**: Type "complete buy groceries", verify AI finds todo, calls complete_todo tool, status changes

### AI Agent Implementation for User Story 3

- [ ] T028 [AI] [US3] Add COMPLETE intent classification to system prompt
  - **Success**: System prompt defines COMPLETE intent with keywords (complete, finish, done, mark)
  - **Verification**: Test "finish the task", verify classifies as COMPLETE intent
  - **Requirement**: FR-003 (classify intent)

- [ ] T029 [AI] [US3] Implement todo identifier extraction for COMPLETE intent
  - **Success**: AI extracts either todo ID (numeric) or title description
  - **Verification**: Test "complete task 5" → extracts id=5; "complete groceries" → extracts title="groceries"
  - **Requirement**: FR-004 (extract parameters)

- [ ] T030 [AI] [US3] Implement fuzzy title matching for COMPLETE intent
  - **Success**: If title provided (not ID), AI calls list_todos, performs case-insensitive partial match
  - **Verification**: Add todo "Buy groceries from store", type "complete groceries", verify finds match
  - **Safety**: Plan fuzzy matching algorithm
  - **Requirements**: FR-018 (fuzzy matching)
  - **Acceptance**: Spec User Story 3, Scenario 3

- [ ] T031 [AI] [US3] Handle multiple matches with clarification request
  - **Success**: If 2+ todos match, AI responds "Multiple todos match: [list]. Please specify which one."
  - **Verification**: Add 2 todos with "review" in title, type "complete review", verify clarification
  - **Requirement**: FR-019 (request clarification for multi-match)
  - **Acceptance**: Spec User Story 3, Scenario 4

- [ ] T032 [AI] [US3] Handle zero matches with helpful error
  - **Success**: If no todos match, AI responds "No todo found matching '[description]'"
  - **Verification**: Type "complete nonexistent", verify error message
  - **Acceptance**: Spec User Story 3, Scenario 5

- [ ] T033 [AI] [US3] Implement complete_todo MCP tool invocation
  - **Success**: After finding match, AI calls complete_todo tool with todo_id and JWT
  - **Verification**: Type "mark task 1 as done", verify AI calls MCP tool and status changes
  - **Domain Rule**: MCP tool ONLY; status transition via backend
  - **Requirements**: FR-012 (use MCP tool for COMPLETE)
  - **Acceptance**: Spec User Story 3, Scenarios 1, 2

- [ ] T034 [AI] [US3] Add confirmation response for completion
  - **Success**: AI responds "Marked '[title]' as completed" after successful tool call
  - **Verification**: Complete todo, verify confirmation
  - **Acceptance**: Spec User Story 3, Scenario 1

**Checkpoint**: User Story 3 complete - AI can complete todos via natural language and MCP tools

**Manual Acceptance Test for US3**:
1. Add todo "buy groceries"
2. Type "complete buy groceries" → Verify status changes to completed
3. Type "mark task 1 as done" → Verify works with ID
4. Add 2 todos with "review" in title
5. Type "complete review" → Verify AI asks for clarification
6. Type "finish something that doesn't exist" → Verify AI says "not found"

---

## Phase 6: User Story 4 (AI Agent) - Natural Language Todo Update (Priority: P4)

**Goal**: AI can update todo titles from natural language

**Independent Test**: Type "change buy milk to buy almond milk", verify AI updates via MCP tool

### AI Agent Implementation for User Story 4

- [ ] T035 [AI] [US4] Add UPDATE intent classification to system prompt
  - **Success**: System prompt defines UPDATE intent with keywords (update, change, rename, edit)
  - **Verification**: Test "change X to Y", verify classifies as UPDATE intent
  - **Requirement**: FR-003 (classify intent)

- [ ] T036 [AI] [US4] Implement old/new title extraction for UPDATE intent
  - **Success**: AI extracts old identifier (ID or title) and new title from command
  - **Verification**: Test "update task 3 to new title" → id=3, new_title="new title"; "change buy milk to buy almond milk" → old="buy milk", new="buy almond milk"
  - **Requirement**: FR-004 (extract parameters)
  - **Acceptance**: Spec User Story 4, Scenarios 1, 2

- [ ] T037 [AI] [US4] Implement fuzzy matching for UPDATE intent (find todo by old title)
  - **Success**: If old title provided, AI calls list_todos and fuzzy matches
  - **Verification**: Add "buy groceries from store", type "change groceries to buy organic groceries", verify finds match
  - **Requirements**: FR-018 (fuzzy matching)
  - **Acceptance**: Spec User Story 4, Scenario 3

- [ ] T038 [AI] [US4] Handle ambiguity in UPDATE intent
  - **Success**: Multi-match → clarification; no match → error
  - **Verification**: Test with multiple matches and no matches, verify appropriate responses
  - **Requirements**: FR-019 (clarification), FR-020 (validate params)
  - **Acceptance**: Spec User Story 4, Scenario 4

- [ ] T039 [AI] [US4] Implement update_todo MCP tool invocation
  - **Success**: After finding match, AI calls update_todo tool with todo_id, new_title, and JWT
  - **Verification**: Type "rename task 2 to updated title", verify AI calls MCP tool and title changes
  - **Domain Rule**: MCP tool ONLY
  - **Requirements**: FR-013 (use MCP tool for UPDATE)
  - **Acceptance**: Spec User Story 4, Scenarios 1, 2

- [ ] T040 [AI] [US4] Add confirmation response for update
  - **Success**: AI responds "Updated: [old_title] → [new_title]"
  - **Verification**: Update todo, verify confirmation with before/after titles
  - **Acceptance**: Spec User Story 4, Scenario 1

**Checkpoint**: User Story 4 complete - AI can update todos via natural language and MCP tools

**Manual Acceptance Test for US4**:
1. Add todo "buy milk"
2. Type "update buy milk to buy almond milk" → Verify title changes
3. Type "rename task 1 to buy organic milk" → Verify works with ID
4. Type "change the milk task to buy soy milk" → Verify fuzzy matching works

---

## Phase 7: User Story 5 (AI Agent) - Natural Language Todo Deletion (Priority: P5)

**Goal**: AI can delete todos from natural language

**Independent Test**: Type "delete buy groceries", verify AI removes via MCP tool

### AI Agent Implementation for User Story 5

- [ ] T041 [AI] [US5] Add DELETE intent classification to system prompt
  - **Success**: System prompt defines DELETE intent with keywords (delete, remove, get rid)
  - **Verification**: Test "remove the task", verify classifies as DELETE intent
  - **Requirement**: FR-003 (classify intent)

- [ ] T042 [AI] [US5] Implement todo identifier extraction for DELETE intent
  - **Success**: AI extracts todo ID or title description
  - **Verification**: Test "delete task 7" → id=7; "remove groceries" → title="groceries"
  - **Requirement**: FR-004 (extract parameters)

- [ ] T043 [AI] [US5] Implement fuzzy matching for DELETE intent
  - **Success**: If title provided, AI calls list_todos and fuzzy matches
  - **Verification**: Add "buy groceries", type "delete groceries", verify finds match
  - **Requirements**: FR-018 (fuzzy matching)

- [ ] T044 [AI] [US5] Add bulk deletion safety check
  - **Success**: If command would delete multiple todos (e.g., "delete all completed"), AI requests confirmation: "This would delete [N] todos. Confirm?"
  - **Verification**: Type "delete all completed", verify AI asks for confirmation
  - **Safety**: Prevent accidental bulk deletion
  - **Requirements**: FR-017 (no actions without confirmation for bulk ops)
  - **Acceptance**: Spec User Story 5, Scenario 3

- [ ] T045 [AI] [US5] Implement delete_todo MCP tool invocation
  - **Success**: After finding match (and confirmation if bulk), AI calls delete_todo tool with todo_id and JWT
  - **Verification**: Type "remove task 3", verify AI calls MCP tool and todo deleted from database
  - **Domain Rule**: MCP tool ONLY
  - **Requirements**: FR-014 (use MCP tool for DELETE)
  - **Acceptance**: Spec User Story 5, Scenarios 1, 2

- [ ] T046 [AI] [US5] Add confirmation response for deletion
  - **Success**: AI responds "Deleted: [title]"
  - **Verification**: Delete todo, verify confirmation
  - **Acceptance**: Spec User Story 5, Scenario 1

- [ ] T047 [AI] [US5] Handle deletion of non-existent todo
  - **Success**: If no match found or backend returns 404, AI responds "No todo found to delete"
  - **Verification**: Type "delete nonexistent", verify error message
  - **Acceptance**: Spec User Story 5, Scenario 4

**Checkpoint**: User Story 5 complete - AI can delete todos via natural language and MCP tools

**Manual Acceptance Test for US5**:
1. Add todo "buy groceries"
2. Type "delete buy groceries" → Verify todo removed
3. Type "remove task 5" → Verify works with ID (or error if doesn't exist)
4. Add 3 completed todos
5. Type "delete all completed" → Verify AI asks for confirmation

---

## Phase 8: Frontend Integration (Chat UI)

**Purpose**: Add chat interface to Phase 2 frontend for AI interaction

**⚠️ Note**: Minimal changes to Phase 2 frontend only (add chat component)

- [ ] T048 [P] [FE] Create `phase-3/frontend-additions/ChatPanel.tsx` component
  - **Success**: React component with message history display, text input, send button
  - **Verification**: Render component in isolation, verify UI displays
  - **Requirement**: FR-001 (chat interface), FR-007 (conversation format)

- [ ] T049 [FE] Add message state management to ChatPanel
  - **Success**: useState for messages array (role: user/assistant, content, timestamp)
  - **Verification**: Add test messages to state, verify displayed in chat
  - **Requirement**: Chat message display

- [ ] T050 [FE] Implement send message handler in ChatPanel
  - **Success**: Handler calls MCP server AI endpoint with user message and JWT from localStorage
  - **Verification**: Type message, click send, verify network request to MCP server
  - **Requirements**: FR-027 (send to AI endpoint), FR-029 (maintain JWT auth)

- [ ] T051 [FE] Add AI response handling to ChatPanel
  - **Success**: Display AI response in chat, append to message history
  - **Verification**: Send message, verify AI response appears in chat
  - **Requirement**: FR-028 (display AI responses)

- [ ] T052 [FE] Add example commands display to ChatPanel
  - **Success**: Show example commands when chat is empty or on first load
  - **Verification**: Open chat, verify examples like "add [task]", "list todos" displayed
  - **Requirement**: FR-030 (example commands)

- [ ] T053 [FE] Add error handling to ChatPanel
  - **Success**: Handle network errors, 401 (redirect to login), and display error messages
  - **Verification**: Stop MCP server, try to send message, verify error displayed
  - **Requirement**: FR-029 (JWT auth), error handling

- [ ] T054 [FE] Copy ChatPanel.tsx to `phase-2/frontend/components/`
  - **Success**: File copied from phase-3/frontend-additions/ to phase-2/frontend/components/
  - **Verification**: File exists in both locations
  - **Requirement**: Integration with Phase 2 frontend

- [ ] T055 [FE] Integrate ChatPanel into `phase-2/frontend/pages/todos.tsx`
  - **Success**: Import and render ChatPanel component on todos page (collapsible panel or bottom section)
  - **Verification**: Visit /todos page, verify chat panel appears
  - **Requirement**: FR-026 (chat panel integration)

- [ ] T056 [FE] Add chat panel styling to match Phase 2 design
  - **Success**: Basic CSS for chat panel (no advanced styling, matches Phase 2 simplicity)
  - **Verification**: Verify chat panel looks consistent with Phase 2 UI
  - **Requirement**: Minimal styling (spec constraint)

**Checkpoint**: Frontend integration complete - Chat UI available on todos page

**Manual Acceptance Test for Frontend**:
1. Visit http://localhost:3000/todos (logged in)
2. Verify chat panel appears
3. Verify example commands displayed
4. Type "hello" → Verify message sent to AI and response appears
5. Verify chat history persists during session

---

## Phase 9: AI Safety & Validation

**Purpose**: Implement safety constraints to prevent hallucinations and unauthorized actions

- [ ] T057 [AI] Add "no hallucination" instruction to system prompt
  - **Success**: System prompt explicitly states "NEVER invent todo IDs or titles; only use data from tool responses"
  - **Verification**: Review prompt, verify anti-hallucination instruction present
  - **Requirement**: FR-016 (no hallucinations)

- [ ] T058 [AI] Implement tool response validation
  - **Success**: AI only references todos that exist in list_todos response; never invents IDs
  - **Verification**: Ask AI "what's in my list", verify only lists actual todos (test with empty list too)
  - **Safety**: Critical anti-hallucination check
  - **Requirement**: FR-016 (no hallucinations)

- [ ] T059 [AI] Add backend error interpretation
  - **Success**: AI interprets 401 → "Please login", 403 → "Todo not accessible", 404 → "Todo not found", 500 → "Service error"
  - **Verification**: Trigger each error code, verify AI explains appropriately
  - **Requirements**: FR-021 (handle backend errors), SC-009 (explain errors)

- [ ] T060 [AI] Test authentication enforcement
  - **Success**: AI cannot perform actions without valid JWT (MCP tools enforce)
  - **Verification**: Remove JWT from localStorage, try AI command, verify error
  - **Domain Rule**: Authentication required (maintained from Phase 2)
  - **Requirements**: FR-009 (JWT required), FR-015 (MCP tools pass JWT)

- [ ] T061 [AI] Test data isolation via AI
  - **Success**: User A's AI cannot access User B's todos (backend enforces via JWT)
  - **Verification**: Login as User A, create todos; login as User B via AI, verify AI only sees User B's todos
  - **Domain Rule**: Data isolation (maintained from Phase 2)
  - **Requirement**: SC-008 (authentication respected)

**Checkpoint**: AI safety complete - No hallucinations, authentication enforced, data isolation maintained

---

## Phase 10: Cross-Cutting & Polish

**Purpose**: Documentation, testing, and final validation

- [ ] T062 [P] Create `phase-3/README.md` with setup instructions
  - **Success**: File contains: overview, architecture diagram, setup steps, run commands, example commands, MCP tool descriptions
  - **Verification**: Follow README, verify can start MCP server and use AI
  - **Requirement**: Documentation

- [ ] T063 [P] Create `phase-3/.env.example` with all environment variables
  - **Success**: File contains BACKEND_URL, MCP_PORT, ANTHROPIC_API_KEY, LLM_MODEL
  - **Verification**: Copy to .env, verify MCP server reads variables
  - **Requirement**: Configuration template

- [ ] T064 Test all 5 user stories end-to-end with natural language
  - **Success**: Complete full test scenario for each user story (US1-US5) via chat
  - **Verification**: Execute manual acceptance tests from task sections above
  - **Requirement**: All acceptance scenarios validated

- [ ] T065 Test intent classification accuracy
  - **Success**: Test 20 sample commands, verify > 90% correct intent classification
  - **Verification**: Commands like "add X", "list", "complete Y", "update Z", "delete W" all classified correctly
  - **Requirement**: SC-006 (intent accuracy > 90%)

- [ ] T066 Test fuzzy matching accuracy
  - **Success**: Partial title matches work; exact ID matches work; clarification for multi-match
  - **Verification**: Test various title variations, verify matching logic
  - **Requirement**: FR-018 (fuzzy matching)

- [ ] T067 Test AI safety (no hallucinations)
  - **Success**: AI never mentions todos that don't exist; only uses MCP tool responses
  - **Verification**: Ask "what todos do I have" with empty list, verify AI says "none" (doesn't invent todos)
  - **Critical**: SC-007 (no hallucinated data)
  - **Requirement**: FR-016 (no hallucinations)

- [ ] T068 Verify Phase 2 backend unchanged
  - **Success**: Run diff on phase-2/backend/, verify zero changes
  - **Verification**: `git diff phase-2/backend` shows no changes
  - **Requirement**: Spec constraint (no backend changes)

- [ ] T069 Verify domain rules maintained
  - **Success**: All Phase 1 & 2 domain rules still enforced (status transitions, title validation, user isolation)
  - **Verification**: Create todo via AI (status=pending), complete it (status=completed), try empty title (rejected by backend)
  - **Domain Consistency**: Constitution Principle IV

**Checkpoint**: Phase 3 complete - AI chatbot functional, safe, and integrated

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start here
- **MCP Foundational (Phase 2)**: Depends on Setup - BLOCKS all AI agent tasks
- **US1 AI Agent (Phase 3)**: Depends on MCP Foundational (needs create_todo tool)
- **US2 AI Agent (Phase 4)**: Depends on MCP Foundational (needs list_todos tool)
- **US3 AI Agent (Phase 5)**: Depends on MCP Foundational (needs list_todos + complete_todo tools)
- **US4 AI Agent (Phase 6)**: Depends on MCP Foundational (needs list_todos + update_todo tools)
- **US5 AI Agent (Phase 7)**: Depends on MCP Foundational (needs list_todos + delete_todo tools)
- **Frontend Integration (Phase 8)**: Can run in parallel with AI agent development
- **Safety & Polish (Phases 9-10)**: Depends on all user stories complete

### Sequential Execution (Recommended)

**MCP Server First**:
1. Phase 1: Setup (T001-T006)
2. Phase 2: MCP Foundational (T007-T016) - 5 tools + server

**Then AI Agent** (build intent handlers):
3. Phase 3: US1 AI (T017-T022) - CREATE intent
4. Phase 4: US2 AI (T023-T027) - LIST intent
5. Phase 5: US3 AI (T028-T034) - COMPLETE intent
6. Phase 6: US4 AI (T035-T040) - UPDATE intent
7. Phase 7: US5 AI (T041-T047) - DELETE intent

**Then Frontend**:
8. Phase 8: Frontend Integration (T048-T056) - Chat UI

**Finally Validation**:
9. Phase 9: AI Safety (T057-T061)
10. Phase 10: Cross-Cutting (T062-T069)

### Parallel Opportunities

**Within MCP Foundational (Phase 2)**:
- T009-T013 (5 tools) can run in parallel (different files)

**AI Agent vs Frontend**:
- After MCP Foundational: AI agent tasks (T017-T047) and frontend tasks (T048-T056) can proceed in parallel

**Within Frontend**:
- T048-T053 (ChatPanel implementation) can run before T054-T056 (integration)

---

## Implementation Strategy

### MVP First (User Story 1 Only)

For fastest value delivery:
1. Complete Setup (T001-T006)
2. Complete MCP Foundational (T007-T016)
3. Complete US1 AI Agent (T017-T022)
4. Complete Frontend Integration (T048-T056)
5. **STOP and VALIDATE**: Test "add buy groceries" end-to-end

This delivers natural language todo creation in ~28 tasks.

### Full AI Chatbot (All User Stories)

1. Setup + MCP Foundational → Tools ready
2. Add US1 AI → Natural language creation
3. Add US2 AI → Natural language listing
4. Add US3 AI → Natural language completion
5. Add US4 AI → Natural language update
6. Add US5 AI → Natural language deletion
7. Frontend Integration → Chat UI
8. Safety & Polish → Production-ready

---

## Notes

- **NO Backend Changes**: Zero tasks modify phase-2/backend/
- **NO Database Changes**: Zero tasks modify schema
- **MCP Tool Isolation**: AI agent ONLY calls MCP tools (never direct backend)
- **Minimal Frontend**: Only ChatPanel component added
- **Stateless AI**: No conversation history storage (Constitution Principle V)
- **Safety First**: Anti-hallucination checks in multiple tasks (T057, T058, T067)
- **Phase Boundaries**: All new code in phase-3/ directory
- **Commit Strategy**: Commit after each phase (10 commits total)

---

## Task Summary

- **Total Tasks**: 69
- **Setup**: 6 tasks (phase-3 structure, configs)
- **MCP Foundational**: 10 tasks (5 tools + server + safety)
- **US1 AI (CREATE)**: 6 tasks (intent, extraction, tool call, confirmation, clarification, help)
- **US2 AI (LIST)**: 5 tasks (intent, filter, tool call, formatting, empty handling)
- **US3 AI (COMPLETE)**: 7 tasks (intent, extraction, fuzzy match, multi-match, no-match, tool call, confirmation)
- **US4 AI (UPDATE)**: 6 tasks (intent, extraction, fuzzy match, ambiguity, tool call, confirmation)
- **US5 AI (DELETE)**: 7 tasks (intent, extraction, fuzzy match, bulk safety, tool call, confirmation, no-match)
- **Frontend Integration**: 9 tasks (ChatPanel component, integration)
- **AI Safety**: 5 tasks (anti-hallucination, auth, error handling)
- **Cross-Cutting**: 8 tasks (README, testing, validation)

**Estimated Completion**:
- MVP (US1 only): 28 tasks → Natural language creation
- With listing (US1-US2): 33 tasks → Create and view via NL
- Full CRUD (US1-US5): 57 tasks → All operations via NL
- Production-Ready (All phases): 69 tasks → Tested and documented

**Constitution Compliance**:
- ✅ Each task independently checkable (Success + Verification)
- ✅ AI logic isolated from core backend (MCP server is separate)
- ✅ MCP tools used explicitly for ALL API calls (emphasized in tasks)
- ✅ Stay strictly within Phase 3 scope (no training, no deployment, no backend changes)
- ✅ Domain rules maintained (references to Phase 1 & 2 rules in tasks)
