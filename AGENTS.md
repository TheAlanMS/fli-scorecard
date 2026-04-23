# AGENTS.md — Agent Behavior Rules

## Read .claude/CLAUDE.md First
Before every task in this repo, read `.claude/CLAUDE.md` in full. It contains the architecture, tech stack locked decisions, data schema, business rules, and coding conventions. Never assume — verify against `.claude/CLAUDE.md`.

---

## Task Approach

1. **Understand before building** — state in 1–2 sentences what you're about to build and which files you'll touch before writing any code
2. **Schema first** — if a task touches data flow, verify your types against `app/src/types/index.ts` before writing component code
3. **One screen at a time** — complete Screen 1 fully before starting Screen 2; don't scaffold all three simultaneously
4. **ETL changes require dual updates** — any change to the JSON output shape requires updating both `etl/schema.py` AND `app/src/types/index.ts` in the same task

---

## File Creation Rules

| What you're creating | Where it goes |
|---|---|
| New screen component | `app/src/components/ComponentName/index.tsx` |
| Shared UI component | `app/src/components/shared/ComponentName.tsx` |
| Shared chart wrapper | `app/src/components/shared/charts/ChartName.tsx` |
| Print layout | `app/src/components/ScreenName/ScreenNamePrint.tsx` |
| New hook | `app/src/hooks/useHookName.ts` |
| New utility | `app/src/utils/utilName.ts` |
| ETL helper | `etl/helpers/helperName.py` |

---

## When to Ask vs. Proceed

### Proceed without asking:
- File and folder structure decisions
- Component architecture within a screen
- Tailwind class choices
- Recharts configuration and chart layout
- TypeScript interface organization (as long as shape doesn't change)

### Stop and ask Alan:
- Any change to the cohort_data.json schema shape (adding/removing/renaming fields)
- New business logic rules for scoring, certification, or flagging
- Adding any new npm or Python dependency not in the existing stack
- Anything that would require Ruben to re-collect or re-export evaluation data

---

## PDF Export Rules

- Each printable view gets its own *Print.tsx component; never mix screen and print layouts
- Print layouts use fixed pixel or inch widths (e.g., w-[8.5in]), not responsive breakpoints
- Always include @media print CSS where needed via Tailwind's print: variant
- Test print layout in browser print preview before marking the task done
- react-to-print wraps the print component; the trigger button lives in the screen component

---

## ETL Development Rules

- Always run ETL against sample_data/sample_cohort.xlsx (not real data) during development
- Validate output JSON against schema.py types before copying to app
- Print a summary to stdout on every successful run: students processed, certified count, avg score
- All ETL functions must handle missing or null cell values gracefully (evaluators may leave blanks)

---

## Never Do

- Never use any in TypeScript — use unknown and narrow, or define a proper type
- Never modify etl/schema.py without a matching update to app/src/types/index.ts in the same commit
- Never commit real student data (only sample/anonymized data in sample_data/)
- Never use console.log for debugging in production React code — use a DEBUG flag or remove before marking done
- Never install a new library to solve something Tailwind + Recharts + react-to-print can already handle
- Never build a screen component that directly imports from cohort_data.json — all data flows through the useCohortData hook
