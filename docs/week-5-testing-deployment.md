# Week 5 Testing + Deployment Runbook

Week 5 is the final delivery pass for the Spring 2026 FLI Scorecard. The goal is to validate Ruben's real cohort workbook outside git, walk staff through every dashboard and PDF flow, resolve confirmed issues, deploy a private Vercel build, and deliver 11 student credential PDFs plus the cohort impact report by May 8, 2026.

This runbook does not change the JSON schema, scoring rules, certification rules, dependencies, backend, database, auth, or routes.

## Guardrails

- Keep Ruben's real `.xlsx` workbook outside this repository.
- Keep real generated `cohort_data.json` out of git. Use it locally for validation and the private deployment artifact only.
- Stop and ask Alan before any requested schema, scoring, certification, or data-collection change.
- Use sample/anonymized data for committed source control state.
- Do not add new dependencies for Week 5 QA, print, or deployment work.

## 1. Real Workbook ETL Validation

Run the sample workbook first:

```bash
cd etl
python etl.py sample_data/sample_cohort.xlsx
```

Then run Ruben's workbook from its external location:

```bash
cd etl
python etl.py "C:/path/outside/repo/ruben-final-cohort.xlsx"
```

Before copying the output into the app, verify:

- Workbook sheets exist: `Self-Eval`, `Peer-Eval`, `Staff-Eval`, `Gates`.
- Stdout prints students processed, certified count, and average weighted score.
- Output has exactly 11 students.
- Each student has 22 values in `self_scores`, `peer_avg`, `peer_count`, `staff_avg`, and `staff_count`.
- Certification counts match the ETL stdout summary.
- Cohort average weighted score matches the ETL stdout summary.

For local QA and deployment only:

```bash
copy etl\cohort_data.json app\src\data\cohort_data.json
```

Before any commit, confirm real data is not staged:

```bash
git status --short
```

## 2. Pre-Walkthrough QA

Build the dashboard:

```bash
cmd /c npm --prefix app run build
```

Preview locally:

```bash
cd app
npm run preview
```

QA coverage:

- Screen 1: cohort count is 11, weighted-score/name/team sorting works, certification badges match the ETL output, and row navigation opens the selected student.
- Screen 2: test at least one certified, conditional, and not-certified student where real data permits; verify radar chart, cluster bars, certification gates, strengths, growth areas, perception gap flags, and student PDF export.
- Screen 3: verify cohort summary, heatmap, self-peer divergence chart, strongest/weakest competencies, cluster rankings, and cohort PDF export.
- AI Self-Check: open `ai-self-check/index.html` and confirm the generated Claude prompt includes context, selected competency, intended score, evidence, uncertainty, and the high-score probing requirement when intended score is 4 or 5.
- Tablet layout: review the dashboard at tablet width and confirm controls, charts, tables, and print triggers remain usable.

## 3. Staff Walkthrough

Walk Ruben through:

- Data import summary from the ETL stdout.
- Screen 1 cohort table, sorting, certification badges, and row navigation.
- Screen 2 student deep dive and student credential PDF export.
- Screen 3 cohort analytics and cohort impact PDF export.
- AI Self-Check prompt-builder flow.

Record every issue with:

- Screen or artifact.
- Student/example, if applicable.
- Expected behavior.
- Actual behavior.
- Severity: blocker, high, medium, or low.

## 4. Bug Resolution

Only fix confirmed Week 5 issues unless Alan approves broader scope.

For each bug:

- Reproduce the broken flow.
- Make the smallest correctness, layout, print, or deployment fix that resolves it.
- Re-run `cmd /c npm --prefix app run build`.
- Re-test the exact broken flow before marking resolved.
- If the fix requires schema, scoring, certification, or data-collection changes, stop and ask Alan first.

## 5. Private Vercel Deployment

Use Vercel project root directory `app`.

Build settings:

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`

Preferred path for real data:

1. Keep the validated real `app/src/data/cohort_data.json` in the local working tree only.
2. Deploy from the local machine so the real JSON is included in the private build artifact.
3. Do not commit the real JSON.

GitHub auto-deploy is acceptable only for sample/anonymized data unless Alan explicitly approves a different real-data handling process.

After deployment, smoke test the private URL:

- Real cohort count is 11.
- Screen 1, Screen 2, Screen 3, and both PDF export triggers load.
- No sample-only names or data appear.
- AI Self-Check artifact is available separately if it is being delivered with the deployment package.

## 6. PDF Delivery

Generate:

- 11 student credential PDFs from Screen 2.
- 1 cohort impact report PDF from Screen 3.

Use filenames:

```text
FLI_Spring_2026_[Student_Name]_Credential.pdf
FLI_Spring_2026_Cohort_Impact_Report.pdf
```

Before delivery, open each PDF and verify:

- Correct student or cohort report content.
- Certification status and gates match the dashboard.
- Layout prints cleanly.
- No sample-only names or data appear.

## Completion Checklist

- [ ] Sample ETL run passes.
- [ ] Real workbook ETL run passes outside git.
- [ ] Real output locally copied to `app/src/data/cohort_data.json`.
- [ ] Pre-walkthrough build passes.
- [ ] Screen 1 QA complete.
- [ ] Screen 2 QA complete.
- [ ] Screen 3 QA complete.
- [ ] AI Self-Check QA complete.
- [ ] Tablet layout verified.
- [ ] Staff walkthrough completed with Ruben.
- [ ] Confirmed walkthrough bugs resolved.
- [ ] Final build passes.
- [ ] Private Vercel deployment smoke-tested.
- [ ] 11 student PDFs generated and checked.
- [ ] Cohort impact report PDF generated and checked.
- [ ] Real workbook and real generated JSON are not committed.
