# Questions for Ruben — FLI Scorecard Clarification Session
Prepared by Alan Salinas · Caelus Consulting · April 25, 2026

These questions need answers before the scorecard system can be finalized.
Bring these to the meeting with Ruben. Answers will determine schema, scoring logic, and dashboard behavior.

---

## SECTION 1 — Cluster & Competency Framework

The competency rubric PDF (FLI_Competency_Validation_System.pdf) and the original project brief describe different frameworks. We need to reconcile them before building further.

**1. How many clusters does the final scorecard use — 4 or 5?**

The PDF rubric the students received shows **4 clusters**:
- Cluster 1: Technical Skills (4 competencies)
- Cluster 2: Product & Business (5 competencies)
- Cluster 3: Human & Leadership (7 competencies)
- Cluster 4: Communication & Systems (6 competencies)

The original brief described **5 clusters** with different names and different competency assignments. Which one is the authoritative framework for scoring?

**2. Are the competency names in the PDF final?**

The names in the rubric PDF differ from the original brief. For example:
- PDF has "No-Code / Low-Code Development" — the brief had "Automation & Workflow Design" in the same slot
- PDF has "Emotional Intelligence (EQ)" — the brief had "Self-Awareness & Emotional Regulation"
- PDF has "Pitch Development & Public Narrative" — the brief had separate "Public Speaking" and "Negotiation" competencies
- The brief's Cluster 4 ("Professional Readiness": Resume, LinkedIn, Interview, Networking) does not appear in the PDF at all
- The brief's Cluster 5 ("Community & Social Impact") does not appear in the PDF at all

Are the names and groupings in the PDF the final, locked version? Or is the brief more accurate?

**3. What are the cluster weights for the final weighted score?**

The original brief assigned weights to 5 clusters (0.18, 0.28, 0.27, 0.17, 0.10). If the framework is now 4 clusters, what should the weights be?

Options to discuss:
- A) Keep custom weights you define (e.g., 0.20 / 0.25 / 0.30 / 0.25)
- B) Weight proportionally by competency count (4/22, 5/22, 7/22, 6/22)
- C) Weight all 22 competencies equally (no cluster weighting)

---

## SECTION 2 — Scoring Formula

**4. How does the final score combine self, peer, and staff?**

The student-facing PDF says: "Your final score = Self Score + Peer Score (avg of 4) + Staff Score"

This is ambiguous — does it mean:
- A) A simple average of the three scores (self + peer_avg + staff) / 3
- B) A weighted average — e.g., self = 20%, peer = 40%, staff = 40%
- C) Something else?

What weight does each evaluator type carry in the final score?

**5. Is the certification threshold of 3.0 correct on the 1–5 scale?**

The rubric anchors are: 1 = Not Yet, 3 = Developing, 5 = Demonstrated.
Is "Certified" defined as a weighted overall of 3.0 or higher? Or is the bar different?

---

## SECTION 3 — Staff Evaluation

**6. Is each student evaluated by exactly ONE staff member?**

The Staff Eval Matrix shows each student is assigned to exactly one staff member:
- Karina: Atalia Kelley, Roze Fadaie
- Javier: Gael Ramirez, Martin Tristán Méndez
- Martin: Citlaly Lopez, Lauren Flores
- Alan: Richard Bernard, Roberto Delgado, Jon Flores
- Italia: Ivan Linares, Sergio Pena

The original system was designed for multiple staff members to rate each student (to flag inter-rater disagreement). Is the single-evaluator-per-student assignment final? If so, the inter-rater divergence feature should be removed.

**7. Should staff members see each other's scores before finalizing their own?**

Or are staff scores meant to be entered independently (blind)?

---

## SECTION 4 — Certification Gates

**8. What are the exact certification gates beyond the score threshold?**

The original brief listed four hard gates:
- `weighted_overall >= 3.0`
- `sprints_complete` (all sprints submitted)
- `demo_day` (presented at Demo Day — April 30)
- `negotiation_sim` (completed the negotiation simulation)

Are these the correct gates? Are there any additions, removals, or name changes?

**9. What defines "CONDITIONAL" status vs. outright "NOT CERTIFIED"?**

Original rule: CONDITIONAL = meets score bar but missing at least one gate (sprint/demo/negotiation).
Is this still the right distinction? Does Ruben want a third category, or just Certified / Not Certified?

---

## SECTION 5 — Peer Evaluation

**10. The peer assignment is strictly cross-team — is that intentional?**

The peer assignments show every student evaluates 4 peers from other teams only. No within-team peer evaluation occurs. The original system flagged cross-team evals as "limited observation." Since all peer evals are cross-team by design, should that flag be removed?

**11. What should happen when a student doesn't complete all 4 peer evaluations?**

If a student only submits 2 or 3 of their 4 assigned peer evaluations, how does that affect:
- The peer avg for the student they didn't rate?
- Their own certification status?

---

## SECTION 6 — Dashboard & Outputs

**12. Who is the primary user of the staff dashboard — and what decision does it support?**

Is the dashboard used:
- A) Before Demo Day: to prepare staff for scoring conversations
- B) After Demo Day: to finalize certification decisions
- C) During: live on the day

Knowing the use case affects what information should be surfaced first.

**13. What does Ruben want to be able to do from the dashboard that he can't do today?**

Open question — let Ruben drive. What's the "aha" moment he's looking for?

**14. What goes on the student-facing PDF credential, exactly?**

Does the credential include:
- All 22 competency scores (self, peer, staff)?
- Cluster averages only?
- Just the certification status + badge?
- A narrative summary?
- FLI / LMNTS branding?

**15. Who receives the cohort impact report PDF, and what does it need to prove?**

Is it going to BCIC, to funders, to the university? What outcome does it need to demonstrate?

---

## SECTION 7 — Data Delivery

**16. When will the Google Form exports (.xlsx) be available?**

Demo Day is April 30. When can we expect the completed self-eval, peer eval, and staff eval exports? The ETL needs to run before the dashboard and PDFs can be generated.

**17. Is there any data from sprints or attendance that needs to feed into the certification gates?**

The `sprints_complete` gate requires a data source. Where does that come from — a separate spreadsheet, a form, manual input?
