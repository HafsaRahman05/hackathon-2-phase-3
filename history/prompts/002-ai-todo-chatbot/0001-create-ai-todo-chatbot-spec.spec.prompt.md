---
id: 0001
title: Create AI Todo Chatbot Spec
stage: spec
date: 2025-12-30
surface: agent
model: claude-sonnet-4-5-20250929
feature: 003-ai-todo-chatbot
branch: 003-ai-todo-chatbot
user: naveed247365
command: /sp.specify
labels: ["spec", "phase-3", "ai-chatbot", "mcp-tools", "natural-language", "intent-recognition"]
links:
  spec: specs/003-ai-todo-chatbot/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/003-ai-todo-chatbot/spec.md
tests:
 - N/A (specification document, no code tests)
---

## Prompt

/sp.specify

Create Phase 3 specification for Hackathon 2: AI-driven Todo Chatbot.

Scope:
- AI chatbot interface for Todo management
- Natural language commands (add, update, delete, complete, list)
- Intent recognition and safe action mapping
- Use MCP tools to call existing backend APIs
- Server remains stateless
- Database remains the only source of truth

Constraints:
- Follow the project constitution strictly
- No changes to existing backend APIs
- No frontend redesign; minimal UI changes only
- Deterministic tool invocation (no hallucinated actions)
- Clear error handling for ambiguous commands

Non-Goals:
- No training or fine-tuning
- No memory outside database
- No deployment or Kubernetes
- No Kafka or Dapr

Exit Criteria:
- User can manage todos via natural language
- AI correctly maps intents to backend API calls
- No unauthorized or unsafe actions
- App runs locally without errors

## Response snapshot

Created comprehensive Phase 3 specification for AI-driven Todo Chatbot with strict MCP tool integration:

**5 Prioritized User Stories**:
- P1 (MVP): Natural Language Todo Creation - "add buy groceries" creates todo via MCP tool
- P2: Natural Language Listing - "list my todos" fetches and displays via MCP tool
- P3: Natural Language Completion - "complete X" marks done via MCP tool
- P4: Natural Language Update - "change X to Y" updates via MCP tool
- P5: Natural Language Deletion - "delete X" removes via MCP tool

**30 Functional Requirements** (FR-001 to FR-030):
- AI Chatbot Interface (FR-001 to FR-007): Chat UI, intent classification, parameter extraction, clarification
- MCP Tool Integration (FR-008 to FR-015): EXCLUSIVE use of MCP tools, JWT passing, 5 tools for CRUD operations
- Intent Recognition & Safety (FR-016 to FR-021): No hallucinations, fuzzy matching, clarification for ambiguity, backend error handling
- Stateless & Database Integrity (FR-022 to FR-025): No conversation memory, fresh data fetch, database as source of truth
- Frontend Integration (FR-026 to FR-030): Chat panel, AI endpoint, JWT auth, example commands

**Domain Rules** (Critical - Maintain Phase 1 & 2 Consistency):
- **Phase 1 & 2 Rules MAINTAINED**: All existing todo rules preserved (status transitions, title validation, user isolation, ownership)
- **AI Agent Rules** (NEW): MCP-only interaction, no hallucinations, no conversation memory, fuzzy matching, clarification for ambiguity
- **MCP Tool Constraint** (Principle VI): AI uses MCP tools EXCLUSIVELY - cannot call backend directly or access database
- **Intent Classification**: 7 intents with deterministic keyword mappings

**MCP Tool Specification** (5 tools wrapping Phase 2 APIs):
1. create_todo: POST /api/todos (title, jwt_token)
2. list_todos: GET /api/todos (jwt_token, status_filter optional)
3. complete_todo: PATCH /api/todos/{id}/complete (todo_id, jwt_token)
4. update_todo: PATCH /api/todos/{id} (todo_id, new_title, jwt_token)
5. delete_todo: DELETE /api/todos/{id} (todo_id, jwt_token)

All tools maintain authentication and pass through backend errors (401, 403, 404).

**Safety Constraints** (Prevent Hallucinations):
- AI cannot invent todo IDs or titles
- AI cannot bypass authentication
- AI requests clarification for ambiguous commands
- AI confirms before bulk operations
- AI trusts backend as authority (404 = not found, no guessing)

**10 Success Criteria** (SC-001 to SC-010):
- Natural language CRUD working
- Intent recognition > 90% accuracy
- No hallucinated data
- Authentication maintained
- Backend errors handled
- Chat UI integrated

**Constitution Compliance** - Special Focus:
✅ Principle IV (Domain Consistency): Phase 1 & 2 rules explicitly maintained, no backend changes
✅ Principle V (Stateless): AI agent stateless, no conversation memory, database as only source
✅ Principle VI (MCP Tools): AI uses MCP tools EXCLUSIVELY (NON-NEGOTIABLE, emphasized throughout spec)

## Outcome

- ✅ Impact: Phase 3 specification complete; AI chatbot layer defined with strict MCP tool constraints; Phase 1 & 2 domain rules maintained; stateless agent architecture; safety constraints prevent hallucinations
- 🧪 Tests: Acceptance testing via natural language commands; intent recognition accuracy testing; safety testing (no hallucinations, no unauthorized actions)
- 📁 Files: Created specs/003-ai-todo-chatbot/spec.md (comprehensive spec with MCP tool definitions and safety constraints)
- 🔁 Next prompts: /sp.plan to generate implementation plan; /sp.clarify for LLM provider choice or MCP server implementation approach
- 🧠 Reflection: Phase 3 adds AI layer while preserving all Phase 1 & 2 domain rules and APIs; MCP tools enforce safe AI-backend boundary (Principle VI); stateless design maintains scalability; no conversation memory keeps database as single source of truth; intent classification provides deterministic natural language mapping; safety constraints critical for preventing hallucinations and unauthorized actions; minimal UI changes respect Phase 2 work

## Evaluation notes (flywheel)

- Failure modes observed: None; spec maintains strict cross-phase consistency
- Graders run and results (PASS/FAIL): Domain consistency PASS (all Phase 1 & 2 rules preserved); Constitution PASS (9/9 principles, Principle VI emphasized); MCP tool spec COMPLETE (5 tools fully defined); Safety constraints CLEAR (no hallucinations, deterministic mapping)
- Prompt variant (if applicable): N/A (standard /sp.specify for Phase 3)
- Next experiment (smallest change to try): Monitor planning to ensure MCP server architecture is simple and backend APIs truly remain unchanged
