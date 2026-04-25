# FLI Scorecard Operations System — CLAUDE.md

## What We're Building
A competency-based evaluation system for the Frontera Leadership Institute (FLI) Spring 2026 cohort (11 students). Transforms Google Form evaluation exports (.xlsx) into:

1. **Interactive React dashboard** (3 screens) for staff decision-making
2. **Per-student PDF credential** — the artifact that travels to employers and BCIC
3. **Cohort impact report PDF** for institutional ROI conversations
4. **Standalone AI Self-Check tool** — students calibrate self-evals before submitting (Anthropic API, Socratic mode)

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

**No backend. No database. No auth.** The Python ETL is the brain. The React app is the face.

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
├── CLAUDE.md                  ← You are here. Read this every session.
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
│       │       │   └── CohortHeatmap.tsx  ← 11×5 cluster heatmap
│       │       ├── CertBadge.tsx          ← Traffic-light status badge
│       │       └── PerceptionGapFlag.tsx  ← Amber flag component
│       ├── hooks/
│       │   └── useCohortData.ts   ← Loads and memoizes cohort_data.json
│       └── utils/
│           └── scoring.ts         ← Score formatting, color thresholds, helpers
│
├── ai-self-check/             ← Standalone AI Self-Check (separate artifact)
│   └── index.html             ← Single-file React app using Anthropic API
│
└── docs/
    ├── build-spec.md          ← Full Option C spec (source: Alan's brief)
    └── KICKOFF_PROMPT.md      ← Claude Code generation prompt for React scaffold
```

---

## Build State Tracker

Update checkboxes as work is completed.

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
[ ] PDF: StudentPrint.tsx renders credential one-pager
[ ] PDF: react-to-print wired to "Export PDF" button on Screen 2
[ ] PDF: CohortPrint.tsx renders BCIC-ready report
[ ] PDF: react-to-print wired to "Export Cohort Report" on Screen 3

Week 4 — AI Self-Check + Polish
[ ] AI Self-Check: Socratic prompt with 22-competency rubric
[ ] AI Self-Check: Handles score ≥ 4 with probing question
[ ] AI Self-Check: Single-file artifact (ai-self-check/index.html)
[ ] App: Edge cases handled (missing scores, incomplete evals)
[ ] App: Mobile-safe layout (tablet minimum)

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