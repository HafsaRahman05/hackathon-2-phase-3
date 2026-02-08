---
id: 0002
title: Create AI Chatbot Implementation Plan
stage: plan
date: 2025-12-30
surface: agent
model: claude-sonnet-4-5-20250929
feature: 003-ai-todo-chatbot
branch: 003-ai-todo-chatbot
user: naveed247365
command: /sp.plan
labels: ["plan", "architecture", "mcp-server", "ai-agent", "claude-api", "fastmcp"]
links:
  spec: specs/003-ai-todo-chatbot/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/003-ai-todo-chatbot/plan.md
tests:
 - N/A (planning document, no code tests)
---

## Prompt

/sp.plan

Create a clear, ordered execution plan for Phase 3 based strictly on the approved Phase 3 specification.

Rules:
- Respect existing backend and frontend architecture
- Keep AI logic isolated and safe
- Ensure each step is verifiable
- Avoid any scope creep

## Response snapshot

Created comprehensive Phase 3 implementation plan with strict architecture preservation:

**Technical Stack**:
- MCP Server: FastMCP (Python) with 5 tool wrappers
- AI Agent: Claude API (haiku/sonnet) with system prompt
- Frontend: ChatPanel.tsx component (minimal addition)
- Servers: Phase 2 backend (8000), frontend (3000), Phase 3 MCP (5000)

**6 Key Design Decisions**:
1. MCP Server: FastMCP with tool wrappers (Principle VI enforcement)
2. AI Agent: Claude API with intent classification
3. Frontend: ChatPanel on /todos page (no redesign)
4. Intent Classification: 7 intents with deterministic mapping
5. MCP Safety: JWT validation + backend error pass-through
6. Fuzzy Matching: Partial match with clarification

**Constitution Check**: ✅ PASS
- Principle VI emphasized: MCP tools EXCLUSIVELY
- Principle V: Stateless AI, no conversation memory
- Principle IV: Phase 2 backend UNCHANGED
- Principle IX: phase-3/ directory

**Architecture Preservation**:
- Phase 2 backend: UNTOUCHED (no code changes)
- Phase 2 database: UNCHANGED (no schema changes)
- Phase 2 frontend: Minimal changes (add chat component only)
- MCP server: Separate process, pure proxy

**Dependencies**: fastmcp, requests, anthropic, python-dotenv (MCP server only)

**Risks**: 5 AI-specific risks with mitigations (hallucinations, auth bypass, ambiguity, error handling, rate limits)

## Outcome

- ✅ Impact: Planning complete; MCP architecture preserves Phase 2; AI design stateless and safe; no backend modifications; ready for tasks
- 🧪 Tests: Natural language testing; hallucination prevention testing; fuzzy matching accuracy
- 📁 Files: Created specs/003-ai-todo-chatbot/plan.md
- 🔁 Next prompts: /sp.tasks for task breakdown; /sp.adr for MCP architecture or AI safety documentation
- 🧠 Reflection: Phase 3 design respects existing work; MCP tools enforce safe boundary; stateless maintains scalability; no scope creep

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Architecture preservation PASS; Constitution PASS; MCP design CLEAR; Safety ENFORCED
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Ensure MCP tasks and AI tasks clearly separated in task breakdown
