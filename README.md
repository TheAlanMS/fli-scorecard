# FLI Scorecard Operations System

**Client:** Frontera Leadership Institute (FLI) — Ruben Cantu  
**Built by:** Alan Salinas — Caelus Consulting  
**Deadline:** ~May 8, 2026  
**Status:** 🔴 Week 1 — In Progress

---

## What This Is

A competency-based evaluation system for FLI's 11-student Spring 2026 cohort. Transforms Google Form evaluation exports into:

- Interactive React dashboard (3 screens) for staff
- Per-student PDF credentials for employers and BCIC
- Cohort impact report for institutional stakeholders
- Standalone AI Self-Check tool for student self-calibration

See `CLAUDE.md` for full architecture, schema, and tech decisions.  
See `docs/` for the build spec and Claude Code kickoff prompt.

---

## Repo Structure

```
fli-scorecard/
├── etl/           Python ETL — run locally to process .xlsx → JSON
├── app/           React dashboard — deploy to Vercel
├── ai-self-check/ Standalone AI Self-Check artifact (Anthropic API)
└── docs/          Build spec and kickoff prompts
```

---

## Quick Start

### Step 1 — Run the ETL (after evaluations are exported from Google Sheets)

```bash
cd etl
pip install -r requirements.txt
python etl.py path/to/evaluations.xlsx
# → Outputs: cohort_data.json
cp cohort_data.json ../app/src/data/cohort_data.json
```

### Step 2 — Run the React app

```bash
cd app
npm install
npm run dev
# → http://localhost:5173
```

### Step 3 — Deploy to Vercel

1. Connect this GitHub repo to Vercel
2. Set **Root Directory** to `app`
3. Vercel auto-detects Vite — no extra config needed
4. Auto-deploys on push to `main`

---

## Data Flow

```
Google Forms → Google Sheets → .xlsx export
     ↓
etl/etl.py  →  cohort_data.json  →  app/src/data/  →  React dashboard
```

**Security:** Real student evaluation data never enters the repo. Use `etl/sample_data/sample_cohort.xlsx` for development. `cohort_data.json` is gitignored.

---

## PDF Export

From the running app:

- **Screen 2** (Student Deep Dive) → "Export PDF" → student credential one-pager
- **Screen 3** (Cohort Analytics) → "Export Cohort Report" → BCIC-ready document

---

## Build Tracker

See `CLAUDE.md` → Build State Tracker section for week-by-week task checklist.