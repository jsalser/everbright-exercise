# Everbright Pipeline

Patient pipeline board tracking mental health patients through treatment stages.

## How to Run

```bash
# Start both API and client
./start.sh

# Stop
./stop.sh
```

API runs on `http://localhost:5128`, client on `http://localhost:5173`.

Requires: .NET 10 SDK, Node.js 18+. SQLite DB is auto-created on first run.

## Implemented Features

**Core**
- REST API with stage listing, movement, and skip rejection
- React kanban board with patients grouped by stage
- Drag-and-drop between columns
- 8 seed patients across all 4 stages

**Stuck Patients**
- Time-in-status (hours) shown on every card
- Cards in Backlog/Screening highlighted red when over 72 hours
- All columns sorted by time in status, longest first

**Stage Movement**
- Forward moves restricted to one stage at a time
- Backward moves allowed with a required reason (modal prompt)
- Move reasons stored and visible in patient detail

**History**
- Every move recorded with from/to status, timestamp, and reason
- Expandable history timeline in the patient detail modal (+/- toggle)

**Declined (Removed) Patients**
- Remove a patient from any stage with a required reason
- Removed patients stay in their column, grayed out and sorted to bottom
- Removal logged in history with reason
- Filter toggle in header: All | Active | Declined
- Restore button to reactivate removed patients

**Detail Modal**
- Click any card to view: status, treatment, insurance, notes, dates, move history
