---
id: 0003
title: Create AI Chatbot Task Breakdown
stage: tasks
date: 2025-12-30
surface: agent
model: claude-sonnet-4-5-20250929
feature: 003-ai-todo-chatbot
branch: 003-ai-todo-chatbot
user: naveed247365
command: /sp.tasks
labels: ["tasks", "breakdown", "phase-3", "mcp-tools", "ai-agent", "isolated"]
links:
  spec: specs/003-ai-todo-chatbot/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/003-ai-todo-chatbot/tasks.md
tests:
 - N/A (task definition document, no code tests)
---

## Prompt

/sp.tasks

Break the Phase 3 execution plan into small, clear, and verifiable tasks.

Rules:
- Each task must be independently checkable
- Keep AI logic isolated from core backend
- Use MCP tools explicitly for API calls
- Stay strictly within Phase 3 scope

## Response snapshot

Created comprehensive Phase 3 task breakdown with strict MCP tool isolation and backend preservation:

**69 Total Tasks** organized into 10 phases:

**Setup** (6): phase-3/ structure, MCP server directory, requirements.txt, .env templates
**MCP Foundational** (10): FastMCP server, 5 tools (create/list/complete/update/delete), JWT validation, error pass-through
**US1 AI - CREATE** (6): Intent classification, title extraction, create_todo MCP tool call, confirmation, clarification, help
**US2 AI - LIST** (5): Intent classification, filter extraction, list_todos MCP tool call, formatting, empty handling
**US3 AI - COMPLETE** (7): Intent, ID/title extraction, fuzzy match, multi-match clarification, complete_todo MCP tool call, confirmation
**US4 AI - UPDATE** (6): Intent, old/new extraction, fuzzy match, update_todo MCP tool call, confirmation
**US5 AI - DELETE** (7): Intent, extraction, fuzzy match, bulk safety, delete_todo MCP tool call, confirmation
**Frontend** (9): ChatPanel component, AI endpoint calls, integration with Phase 2
**AI Safety** (5): Anti-hallucination prompt, validation, error interpretation, auth testing
**Cross-Cutting** (8): README, testing, Phase 2 unchanged verification

**Key Features**:
- **MCP Tools Explicit**: Every AI task specifies which MCP tool (create_todo, list_todos, etc.)
- **Backend Isolation**: T068 verifies phase-2/backend/ has zero changes
- **Independently Checkable**: All 69 tasks have Success + Verification
- **Safety Emphasis**: 5 dedicated safety tasks (T015, T057, T058, T060, T061, T067)
- **NO Scope Creep**: Zero training tasks, zero deployment tasks, zero backend modification tasks

**Critical Safety Tasks**:
- T015: JWT validation in MCP tools (auth enforcement)
- T057: Anti-hallucination system prompt
- T058: Tool response validation (no invented data)
- T067: Hallucination prevention testing
- T068: Verify Phase 2 backend unchanged (architecture preservation)

**MCP Tool Usage Pattern** (emphasized in tasks):
- CREATE intent → create_todo MCP tool
- LIST intent → list_todos MCP tool
- COMPLETE intent → list_todos (for fuzzy match) + complete_todo MCP tool
- UPDATE intent → list_todos (for fuzzy match) + update_todo MCP tool
- DELETE intent → list_todos (for fuzzy match) + delete_todo MCP tool

**Architecture Preservation**:
- Phase 2 backend: UNTOUCHED (T068 validates)
- Phase 2 database: UNCHANGED (no schema tasks)
- Phase 2 frontend: Minimal (ChatPanel only)
- MCP server: Isolated in phase-3/

**Incremental Delivery**:
1. MVP (28 tasks): NL todo creation
2. With listing (33 tasks): Create + view via NL
3. Full CRUD (57 tasks): All operations via NL
4. Production (69 tasks): Safe, tested, documented

## Outcome

- ✅ Impact: Task definition complete; 69 tasks with MCP tool isolation; backend preservation guaranteed via T068; safety tasks included; ready for implementation
- 🧪 Tests: Natural language acceptance testing; intent accuracy > 90%; hallucination prevention (T067); fuzzy matching validation
- 📁 Files: Created specs/003-ai-todo-chatbot/tasks.md
- 🔁 Next prompts: /sp.implement to execute tasks; ensure Phase 2 backend remains unchanged throughout
- 🧠 Reflection: Task breakdown enforces MCP-only AI interaction (Principle VI); safety tasks prevent hallucinations; backend isolation explicit (T068); stateless design (no conversation memory tasks); domain consistency (T069 validates Phase 1 & 2 rules maintained)

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Backend isolation EXPLICIT (T068); MCP tools CLEAR (every AI task specifies tool); Safety COMPLETE (anti-hallucination tasks); Scope STRICT (no training, no deployment, no backend mods)
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): During implementation, validate that no Phase 2 files are accidentally modified and MCP tools truly isolate AI from backend
