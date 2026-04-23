# FLI Scorecard Operations System

**Client:** Frontera Leadership Institute (FLI) - Ruben Cantu  
**Built by:** Alan Salinas - Caelus Consulting  
**Deadline:** ~May 8, 2026  
**Status:** Week 5 ready - testing, private deployment, and delivery

---

## What This Is

A competency-based evaluation system for FLI's 11-student Spring 2026 cohort. Transforms Google Form evaluation exports into:

- Interactive React dashboard (3 screens) for staff
- Per-student PDF credentials for employers and BCIC
- Cohort impact report for institutional stakeholders
- Standalone AI Self-Check tool for student self-calibration

See `.claude/CLAUDE.md` for full architecture, schema, and tech decisions.  
See `docs/week-5-testing-deployment.md` for final QA, private deployment, and PDF delivery steps.

---

## Repo Structure

```text
fli-scorecard/
|-- etl/           Python ETL - run locally to process .xlsx to JSON
|-- app/           React dashboard - deploy to Vercel
|-- ai-self-check/ Standalone AI Self-Check prompt builder (no API)
`-- docs/          Build specs, prompts, and delivery runbooks
```

---

## Quick Start

### Step 1 - Run the ETL

After evaluations are exported from Google Sheets:

```bash
cd etl
pip install -r requirements.txt
python etl.py path/to/evaluations.xlsx
# Outputs: cohort_data.json
cp cohort_data.json ../app/src/data/cohort_data.json
```

For development, use `etl/sample_data/sample_cohort.xlsx`. Real student workbooks and real generated JSON must stay out of git.

### Step 2 - Run the React App

```bash
cd app
npm install
npm run dev
# http://localhost:5173
```

### Step 3 - Deploy to Vercel

Use Vercel project root directory `app`.

- Build command: `npm run build`
- Output directory: `dist`
- Framework preset: Vite

For real student data, prefer a local Vercel deploy with the validated, uncommitted `app/src/data/cohort_data.json`. GitHub auto-deploy should only use sample/anonymized data unless Alan approves a different real-data handling process.

---

## Data Flow

```text
Google Forms -> Google Sheets -> .xlsx export
     |
etl/etl.py -> cohort_data.json -> app/src/data/ -> React dashboard
```

**Security:** Real student evaluation data never enters the repo. Use `etl/sample_data/sample_cohort.xlsx` for development. `cohort_data.json` is gitignored.

---

## PDF Export

- **Screen 2** (Student Deep Dive) -> "Export PDF" -> student credential one-pager
- **Screen 3** (Cohort Analytics) -> "Export Cohort Report" -> BCIC-ready document

## AI Self-Check

Open `ai-self-check/index.html` directly in a browser. It builds a copyable Claude prompt locally; it does not call Anthropic APIs, require a key, or store student data.

---

## Build Tracker

See `.claude/CLAUDE.md` -> Build State Tracker section for week-by-week task checklist, and `docs/week-5-testing-deployment.md` for the final delivery checklist.
