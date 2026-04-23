# FLI Scorecard Operations System — CLAUDE.md

## What We're Building
A competency-based evaluation system for the Frontera Leadership Institute (FLI) Spring 2026 cohort (11 students). Transforms Google Form evaluation exports (.xlsx) into:

1. **Interactive React dashboard** (3 screens) for staff decision-making
2. **Per-student PDF credential** — the artifact that travels to employers and BCIC
3. **Cohort impact report PDF** for institutional ROI conversations
4. **Standalone AI Self-Check tool** — prompt-only Socratic self-check; no API key, backend, auth, or stored student data

**Client:** Ruben Cantu, Frontera Leadership Institute  
**Built by:** Alan Salinas — Caelus Consulting  
**Deadline:** ~May 8, 2026

---

## Architecture

```
Google Forms → Google Sheets → Download .xlsx
       ↓
  Python ETL (etl/etl.py) — run locally by Alan
       ↓
  cohort_data.json → copy to → app/src/data/cohort_data.json
       ↓
  React App (app/) — reads JSON statically at build time
       ↓
  Vercel deployment (private link, no auth needed for staff)
       + PDF Export (react-to-print)
```

**No backend. No database. No auth.** The Python ETL is the brain. The React app is the face. The AI Self-Check is a local prompt-builder artifact only; students or facilitators paste its generated prompt into their own Claude session.

---

## Tech Stack (Locked — Do Not Change Without Discussion)

| Layer | Choice | Reason |
|---|---|---|
| React scaffold | Vite + TypeScript | Fast, modern, no CRA legacy debt |
| Styling | Tailwind CSS v3 | Utility-first; no CSS files to maintain |
| Charts | Recharts | Radar, bar, composable; good TS support |
| PDF export | react-to-print | Simpler than html2canvas+jsPDF for styled components |
| Python | 3.11+ | Dataclasses, match statements, modern typing |
| xlsx parsing | openpyxl | Lightweight; pandas is overkill for this use case |
| Deployment | Vercel | Free tier, deploy from /app subfolder of monorepo |

---

## Competency Framework (22 Competencies, 5 Clusters)

```
Cluster 1 — AI & Digital Fluency (weight: 0.18, 4 competencies)
  1.  AI Literacy & Prompting
  2.  Automation & Workflow Design
  3.  Digital Research & Synthesis
  4.  Data Interpretation & Storytelling

Cluster 2 — Product & Entrepreneurial Thinking (weight: 0.28, 6 competencies)
  5.  Problem Framing & Root Cause Analysis
  6.  Market & User Research
  7.  Product Ideation & MVP Design
  8.  Business Model Thinking
  9.  Execution & Iteration
  10. Systems Thinking

Cluster 3 — Leadership & Social Influence (weight: 0.27, 6 competencies)
  11. Self-Awareness & Emotional Regulation
  12. Team Collaboration & Trust-Building
  13. Conflict Navigation & Resolution
  14. Public Speaking & Presentation
  15. Coaching & Mentoring Others
  16. Negotiation & Persuasion

Cluster 4 — Professional Readiness (weight: 0.17, 4 competencies)
  17. Resume & LinkedIn Presence
  18. Interview Readiness
  19. Professional Communication
  20. Networking & Relationship Building

Cluster 5 — Community & Social Impact (weight: 0.10, 2 competencies)
  21. Cultural Competence & Inclusion
  22. Community Problem-Solving
```

Cluster weights sum to 1.0: [0.18, 0.28, 0.27, 0.17, 0.10]  
Each competency has **equal weight within its cluster**.

---

## Data Schema (Contract Between ETL and React)

**`etl/schema.py`** is the Python source of truth.  
**`app/src/types/index.ts`** is the TypeScript mirror.  

**Rule: Never change the JSON shape in one file without updating the other.**

The JSON shape produced by ETL and consumed by React:

```json
{
  "cohort": {
    "name": "Spring 2026 — Brownsville",
    "students": 11,
    "certified": 8,
    "avg_weighted_score": 3.6
  },
  "competencies": [
    { "id": 1, "name": "AI Literacy & Prompting", "cluster": "AI & Digital Fluency", "cluster_index": 0, "weight": 0.045 }
  ],
  "students": [
    {
      "id": "student_1",
      "name": "Maria Garcia",
      "team": "Team A",
      "scores": {
        "self_scores": [4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3],
        "peer_avg":    [3.7, 3.3, 4.0, 3.0, 3.7, 3.3, 4.0, 3.0, 3.7, 3.3, 3.7, 3.7, 3.3, 4.0, 3.0, 2.3, 3.7, 3.3, 4.0, 3.0, 3.7, 3.3],
        "peer_count":  [3, 3, 4, 3, 3, 3, 4, 3, 3, 3, 3, 3, 3, 4, 3, 3, 3, 3, 4, 3, 3, 3],
        "staff_avg":   [4.0, 3.5, 4.0, 3.5, 4.0, 3.5, 4.0, 3.5, 4.0, 3.5, 4.0, 3.5, 4.0, 3.5, 4.0, 3.5, 4.0, 3.5, 4.0, 3.5, 4.0, 3.5],
        "staff_count": [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
      },
      "cluster_averages": {
        "ai_digital": 3.5,
        "product": 3.7,
        "leadership": 3.6,
        "professional": 3.7,
        "community": 3.5
      },
      "weighted_overall": 3.63,
      "certification": {
        "status": "CERTIFIED",
        "meets_score_bar": true,
        "sprints_complete": true,
        "demo_day": true,
        "negotiation_sim": true
      },
      "flags": {
        "perception_gaps": [
          { "competency_id": 16, "competency_name": "Negotiation & Persuasion", "self_score": 4.0, "peer_avg": 2.3, "gap": 1.7 }
        ],
        "staff_divergence": []
      }
    }
  ],
  "cohort_analytics": {
    "strongest_competencies": ["AI Literacy & Prompting", "Public Speaking & Presentation", "Team Collaboration & Trust-Building"],
    "weakest_competencies": ["Automation & Workflow Design", "Negotiation & Persuasion", "Market & User Research"],
    "avg_self_vs_peer_gap": 0.4,
    "cluster_rankings": [
      { "cluster": "Leadership & Social Influence", "avg_score": 3.8, "rank": 1 }
    ]
  }
}
```

---

## Project Structure

```
fli-scorecard/
├── .claude/
│   └── CLAUDE.md              ← You are here. Read this every session.
├── AGENTS.md                  ← Agent behavior rules
├── README.md                  ← Setup and run instructions
├── .gitignore
│
├── etl/                       ← Python ETL (run locally by Alan)
│   ├── requirements.txt
│   ├── schema.py              ← JSON schema (Python dataclasses) — source of truth
│   ├── etl.py                 ← Main ETL script
│   ├── validators.py          ← Data quality checks
│   └── sample_data/           ← Anonymized test .xlsx (gitignored if real data)
│       └── sample_cohort.xlsx
│
├── app/                       ← React dashboard (deployed to Vercel)
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── src/
│       ├── main.tsx
│       ├── App.tsx            ← Screen routing logic
│       ├── types/
│       │   └── index.ts       ← TypeScript mirror of schema.py — keep in sync
│       ├── data/
│       │   └── cohort_data.json   ← Drop ETL output here before build/dev
│       ├── components/
│       │   ├── CohortTable/       ← Screen 1: Cohort Command Center
│       │   │   └── index.tsx
│       │   ├── StudentDeepDive/   ← Screen 2: Student Deep Dive
│       │   │   ├── index.tsx
│       │   │   └── StudentPrint.tsx   ← Print-only layout for PDF
│       │   ├── CohortAnalytics/   ← Screen 3: Cohort Analytics
│       │   │   ├── index.tsx
│       │   │   └── CohortPrint.tsx    ← Print-only layout for PDF
│       │   └── shared/
│       │       ├── charts/
│       │       │   ├── RadarChart.tsx     ← Self/peer/staff overlay radar
│       │       │   ├── ClusterBars.tsx    ← 5-cluster bar chart
│       │       │   ├── CohortHeatmap.tsx  ← 11×5 cluster heatmap
│       │       │   └── SelfPeerDivergenceChart.tsx  ← Self-vs-peer gap chart
│       │       ├── CertBadge.tsx          ← Traffic-light status badge
│       │       └── PerceptionGapFlag.tsx  ← Amber flag component
│       ├── hooks/
│       │   └── useCohortData.ts   ← Loads and memoizes cohort_data.json
│       └── utils/
│           └── scoring.ts         ← Score formatting, color thresholds, helpers
│
├── ai-self-check/             ← Standalone AI Self-Check (separate artifact)
│   └── index.html             ← Single-file static prompt builder; no external APIs
│
└── docs/
    ├── build-spec.md          ← Full Option C spec (source: Alan's brief)
    └── KICKOFF_PROMPT.md      ← Claude Code generation prompt for React scaffold
```

---

## Build State Tracker

Update checkboxes as work is completed.

## Current Dashboard Implementation

Week 2 dashboard screens are implemented in `app/src` and verified with `cmd /c npm --prefix app run build`.

- **Screen 1: Cohort Command Center** lives in `components/CohortTable/index.tsx`. It renders students from `useCohortData`, supports sorting by weighted score, name, and team, shows `CertBadge`, and sends the selected student ID to `App.tsx` when a row is clicked.
- **Screen 2: Student Deep Dive** lives in `components/StudentDeepDive/index.tsx`. It shows the selected student's summary, certification gates, `RadarChart`, `ClusterBars`, top strengths, growth areas, and amber `PerceptionGapFlag` cards. Strengths and growth areas are generated from `utils/scoring.ts`. It also wires `react-to-print` to an "Export PDF" button and renders the hidden print-only `StudentPrint.tsx` credential layout.
- **Screen 3: Cohort Analytics** lives in `components/CohortAnalytics/index.tsx`. It shows cohort summary cards, `CohortHeatmap`, `SelfPeerDivergenceChart`, cluster rankings, and strongest/weakest competencies from `cohort_analytics`. It also wires `react-to-print` to an "Export Cohort Report" button and renders the hidden print-only `CohortPrint.tsx` report layout.
- **Routing** stays in `App.tsx` with local screen state only. There is still no backend, database, auth, or async data fetching.
- **Chart rule:** screen components should keep using shared wrappers under `components/shared/charts/`; do not import Recharts primitives directly into screen components.

```
Week 1 — Data Pipeline + Scaffold
[x] ETL: schema.py complete with all 22 competencies
[x] ETL: etl.py parses self-eval sheet
[x] ETL: etl.py parses peer-eval sheet (aggregates per student)
[x] ETL: etl.py parses staff-eval sheet
[x] ETL: compute_cluster_averages() working
[x] ETL: compute_weighted_overall() working
[x] ETL: perception gap + staff divergence flags working
[x] ETL: outputs valid cohort_data.json from sample .xlsx
[x] App: Vite + React + TypeScript + Tailwind scaffolded
[x] App: cohort_data.json loaded via useCohortData hook
[x] App: RadarChart component renders with sample data

Week 2 — Dashboard Screens
[x] Screen 1: Cohort table renders all students
[x] Screen 1: Sort by weighted score, name, team
[x] Screen 1: Traffic-light cert badges (green/yellow/red)
[x] Screen 1: Click row → navigate to Screen 2
[x] Screen 2: Radar chart with self/peer/staff overlay
[x] Screen 2: Cluster bar chart with threshold line at 3.0
[x] Screen 2: Top 3 Strengths / Top 3 Growth Areas auto-generated
[x] Screen 2: Perception gap flags shown in amber
[x] Screen 3: 11×5 cluster heatmap
[x] Screen 3: Self vs. peer divergence chart
[x] Screen 3: Strongest/weakest competencies from cohort_analytics

Week 3 — Real Data + PDF Export
[ ] ETL: Process real evaluation .xlsx files
[x] PDF: StudentPrint.tsx renders credential one-pager
[x] PDF: react-to-print wired to "Export PDF" button on Screen 2
[x] PDF: CohortPrint.tsx renders BCIC-ready report
[x] PDF: react-to-print wired to "Export Cohort Report" on Screen 3

### Current Week 3 Implementation

- **Real-data ETL remains open.** Ruben's real workbook has not been processed in-repo and must stay
  outside git. The current committed app data should remain sample/anonymized until Alan explicitly
  copies validated real ETL output into `app/src/data/cohort_data.json`.
- **Student PDF export is implemented.** `StudentPrint.tsx` is a separate fixed-width print layout
  and `StudentDeepDive/index.tsx` passes typed student, competency, strength, and growth-area props
  into the hidden print component.
- **Cohort PDF export is implemented.** `CohortPrint.tsx` is a separate fixed-width report layout
  and `CohortAnalytics/index.tsx` passes typed cohort, student, certification, and gap-summary props
  into the hidden print component.
- **Verification completed:** `cmd /c npm --prefix app run build` passes. The sample ETL run from
  `etl/` with `python etl.py sample_data\sample_cohort.xlsx` prints: 3 students processed,
  1 certified, average weighted score 3.04.

### Week 3 Execution Plan

Week 3 keeps the current JSON schema and the existing four-sheet workbook contract. Do not change
`cohort_data.json`, `etl/schema.py`, or `app/src/types/index.ts` unless Ruben's export cannot be
normalized into the current shape. If a schema change becomes necessary, stop and ask Alan first.

**Real Data ETL**

- Process Ruben's real `.xlsx` outside this repository. Do not commit the workbook or any real
  student data.
- Confirm the workbook includes the required sheets before processing: `Self-Eval`, `Peer-Eval`,
  `Staff-Eval`, and `Gates`.
- Run the ETL against `etl/sample_data/sample_cohort.xlsx` first during development.
- Validate the generated JSON before copying it into `app/src/data/cohort_data.json`: 11 students,
  every score array has 22 values, certification counts match the ETL summary, average weighted
  score matches stdout, and no required workbook sheet is missing.
- Every successful ETL run should print: students processed, certified count, and average score.

**Student PDF Export**

- Add `app/src/components/StudentDeepDive/StudentPrint.tsx` as a separate print-only component.
- The student print layout is a fixed `w-[8.5in]` credential one-pager that receives typed props
  from `StudentDeepDive/index.tsx`.
- Include student name, team, weighted score, certification status, certification gates, cluster
  averages, top strengths, growth areas, and perception gap flags.
- Wire `useReactToPrint({ contentRef, documentTitle })` in `StudentDeepDive/index.tsx`.
- Keep the print component hidden from the dashboard screen and trigger it with an "Export PDF"
  button in the screen header.

**Cohort PDF Export**

- Add `app/src/components/CohortAnalytics/CohortPrint.tsx` as a separate print-only component.
- The cohort print layout is a fixed `w-[8.5in]` BCIC-ready report that receives typed props from
  `CohortAnalytics/index.tsx`.
- Include cohort summary, certification rate, strongest and weakest competencies, cluster rankings,
  heatmap-style cluster summary, and self-peer divergence highlights.
- Wire `useReactToPrint({ contentRef, documentTitle })` in `CohortAnalytics/index.tsx`.
- Keep dashboard navigation/header clutter out of the printed report.

**Week 3 Verification**

- Run `cmd /c npm --prefix app run build` after wiring both print exports.
- In browser print preview, verify Screen 2 for at least one certified, conditional, and
  not-certified student if data permits.
- In browser print preview, verify Screen 3 fits cleanly on print pages.
- Confirm no real `.xlsx` workbook or real generated JSON is staged for commit.

Week 4 — AI Self-Check + Polish
[x] AI Self-Check: Prompt-only Socratic self-check flow documented
[x] AI Self-Check: 22-competency rubric embedded in generated Claude prompt
[x] AI Self-Check: Handles intended score >= 4 with required probing question
[x] AI Self-Check: Single-file static artifact (`ai-self-check/index.html`)
[x] App: Edge cases handled for missing scores and incomplete evals
[ ] App: Tablet-safe layout verified

### Current Week 4 Implementation Plan

Week 4 changes the AI Self-Check from a live API design into a standalone prompt-builder artifact. `ai-self-check/index.html` asks the student or facilitator for context, selected competency, intended score, supporting evidence, and uncertainties, then generates a Claude-ready Socratic calibration prompt.

- No Anthropic API key is required.
- No backend/proxy is added.
- No auth or stored student data is added.
- The student or facilitator runs the generated prompt in their own Claude session.
- The self-check is calibration support only; it does not change ETL scoring, certification rules, or dashboard schema.
- Intended scores >= 4 must require Claude to ask at least one probing question about evidence quality, consistency, independence, or impact before accepting the high score.

Week 5 — Testing + Deployment
[ ] Staff walkthrough completed with Ruben
[ ] Bug fixes from walkthrough resolved
[ ] Vercel deployment live (private link)
[ ] All 11 student PDFs generated and delivered
[ ] Cohort impact report PDF delivered to Ruben
```

---

## Key Business Rules (Implement Exactly As Specified)

1. **Certification:** `weighted_overall ≥ 3.0` AND `sprints_complete` AND `demo_day` AND `negotiation_sim`
2. **CONDITIONAL status:** meets score bar but missing ≥ 1 gate (sprints/demo/negotiation)
3. **Perception gap flag:** `self_score - peer_avg ≥ 1.5` for any competency
4. **Staff inter-rater gap flag:** `max(staff_scores) - min(staff_scores) ≥ 1.5` for any competency
5. **Peer average:** mean of 3–4 peer scores; handle unequal counts without error
6. **Cross-team peer evals:** tag as limited-observation; include in peer_avg in V1 (do not exclude)
7. **Weighted overall formula:** `sum(cluster_avg[i] × cluster_weight[i])` for i in 0..4
8. **Cluster weight boundaries:** competencies 1–4 → cluster 1, 5–10 → cluster 2, 11–16 → cluster 3, 17–20 → cluster 4, 21–22 → cluster 5

---

## Coding Conventions

- **TypeScript strict mode** — `"strict": true` in tsconfig; no `any` types
- **Components** — one component per file; named exports; no default exports except App.tsx
- **Data** — JSON is loaded statically; no async fetching, no useEffect for data in V1
- **Print layouts** — `*Print.tsx` files are separate from screen layouts; use fixed widths (8.5in) not responsive classes
- **Chart wrappers** — wrap Recharts in typed components under `shared/charts/`; never use Recharts primitives directly in screen components
- **No inline styles** — Tailwind only; if Tailwind can't express it, add to `tailwind.config.ts`
- **Naming** — components: PascalCase; hooks: camelCase with `use` prefix; utils: camelCase

---

## What NOT To Do

- Do NOT add a backend, database, or auth layer in V1
- Do NOT use pandas in the ETL (openpyxl only)
- Do NOT use styled-components, Emotion, or CSS modules
- Do NOT hard-code any student names, scores, or team assignments in React components
- Do NOT change `cohort_data.json` schema without updating both `schema.py` AND `types/index.ts`
- Do NOT commit real student data to the repo (sample_data/ is gitignored)
- Do NOT install new npm dependencies without stating why the existing stack cannot handle it
- Do NOT build Screens 2 or 3 before Screen 1 is wired to real data
