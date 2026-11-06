# Everbright Pipeline

Patient pipeline board for tracking mental health patients through treatment stages.

## How to Run

```bash
./start.sh   # starts API + client
./stop.sh    # stops both
```

API: `http://localhost:5128` | Client: `http://localhost:5173`

Requires .NET 10 SDK and Node.js 18+. SQLite DB auto-creates on first run.

## Features

**Core:** REST API with stage listing, movement, skip rejection. React kanban with drag-and-drop. 8 seed patients.

**Stuck patients:** Hours in status on every card. Red highlight over 72h (Backlog/Screening). Sorted longest-waiting first.

**History:** Every move logged with from/to, timestamp, reason. Expandable timeline in detail modal.

**Backward moves:** Allowed with required reason via modal prompt. Stored and visible in patient detail.

**Declined patients:** Remove from any stage with required reason, logged in history. Grayed out, sorted to bottom. All/Active/Declined filter toggle. Restore capability.

**Detail modal:** Status, treatment, insurance, notes, dates, move history.

## Scope Cuts & What's Next

- **Auth** — all endpoints anonymous. Add JWT/cookie auth with role-based access.
- **Application layer** — auth, validation, error mapping are inline or missing. Extract a proper layer between API and service.
- **Input validation** — none. Add FluentValidation or data annotations.
- **Tests** — none. Add domain, service, and API integration tests.
- **Migrations** — using `EnsureCreated()`. Switch to EF Core migrations.
- **Error handling** — raw stack traces. Add RFC 7807 problem details middleware.
- **Configuration** — connection string and CORS origins hardcoded. Move to config/env vars.

## AI Tool Usage

Built with Claude Code (Claude Opus). AI agents are a tremendous boost so long as you are watching and guiding what they do at each step. The model handled scaffolding, boilerplate, and multi-file changes quickly — the DDD refactor, drag-and-drop, and seed data all saved significant time. All four bonuses were attempted because AI made the throughput realistic.

**Where I corrected the model:**
- Would commit and push without being asked — had to enforce explicit instruction only.
- Misdiagnosed a card visibility bug as "working correctly" from headless screenshots. Actual cause: CSS class properties overriding inline styles. Took several rounds of pushback.
- Kept choosing near-invisible reds (#fef2f2, #fee2e2). Had to manually dial in the RGB value.

## Reasoning & Tradeoffs

**All four bonuses, not one polished.** The spec says pick one or none. AI-assisted throughput made breadth realistic, and none are half-baked — each is functional and demonstrable.

**Architecture:** Simplified DDD — thin API endpoints → service layer (`PipelineService`) → domain entity (`PipelineItem`). No distinct application layer; cross-cutting concerns (auth, validation, error mapping) are inline or noted as TODOs. Production would add that layer between API and service.

**Domain events** dispatched synchronously inline before `SaveChangesAsync()` — state change and history write in the same transaction. Production would use MediatR or an outbox.

**Declined stays in-column, not removed from board.** The spec says "removed from the board but remain tracked." Keeping them visible but grayed out is better for clinical workflows — you see a patient's last stage at a glance instead of hunting through a separate list.

**Backward moves are unrestricted in distance.** Forward moves enforce one-step-at-a-time; backward moves can jump multiple stages. Going back is corrective, not progressive — requiring a patient to step through each intermediate stage on the way back adds friction without value.

**SQLite** for zero-config local setup. Swap to Postgres for production.

**Minimal API over controllers** — faster to scaffold at this scale. Controllers make more sense as the API grows.

**72-hour stuck threshold** — long enough to avoid noise, short enough to surface patients needing attention. Would be configurable in production.
