"""
FLI Scorecard ETL
==================
Processes Google Form evaluation exports (.xlsx) into cohort_data.json.

Usage:
    python etl.py path/to/evaluations.xlsx

Output:
    cohort_data.json  →  copy to app/src/data/cohort_data.json

Sheet naming convention expected in .xlsx:
    "Self-Eval"   — self-evaluation responses
    "Peer-Eval"   — peer evaluation responses
    "Staff-Eval"  — staff evaluation responses
    "Gates"       — sprint completion, demo day, negotiation sim booleans
"""

import json
import sys
from dataclasses import asdict
from pathlib import Path

import openpyxl

from schema import (
    CERTIFICATION_SCORE_THRESHOLD,
    CLUSTER_BOUNDARIES,
    CLUSTER_KEYS,
    CLUSTER_WEIGHTS,
    COMPETENCIES,
    PERCEPTION_GAP_THRESHOLD,
    STAFF_DIVERGENCE_THRESHOLD,
    CertificationRecord,
    CertificationStatus,
    ClusterAverages,
    ClusterRanking,
    CohortAnalytics,
    CohortData,
    CohortSummary,
    PerceptionGapFlag,
    StaffDivergenceFlag,
    Student,
    StudentFlags,
    StudentScores,
)


# ─────────────────────────────────────────
# Sheet Name Config (update if Google Forms
# exports use different tab names)
# ─────────────────────────────────────────

SHEET_SELF_EVAL  = "Self-Eval"
SHEET_PEER_EVAL  = "Peer-Eval"
SHEET_STAFF_EVAL = "Staff-Eval"
SHEET_GATES      = "Gates"


# ─────────────────────────────────────────
# Entry Point
# ─────────────────────────────────────────

def main(xlsx_path: str) -> None:
    path = Path(xlsx_path)
    if not path.exists():
        print(f"Error: File not found: {xlsx_path}")
        sys.exit(1)

    print(f"Processing: {path.resolve()}")
    wb = openpyxl.load_workbook(path, data_only=True)

    students = parse_evaluations(wb)
    cohort_analytics = compute_cohort_analytics(students)

    output = CohortData(
        cohort=CohortSummary(
            name="Spring 2026 — Brownsville",
            students=len(students),
            certified=sum(
                1 for s in students
                if s.certification.status == CertificationStatus.CERTIFIED
            ),
            avg_weighted_score=round(
                sum(s.weighted_overall for s in students) / len(students), 2
            ),
        ),
        competencies=COMPETENCIES,
        students=students,
        cohort_analytics=cohort_analytics,
    )

    out_path = Path("cohort_data.json")
    with open(out_path, "w") as f:
        json.dump(asdict(output), f, indent=2)

    print(f"\n✓ Output written to: {out_path}")
    print(f"  Students processed : {output.cohort.students}")
    print(f"  Certified          : {output.cohort.certified}")
    print(f"  Avg weighted score : {output.cohort.avg_weighted_score}")
    print(f"\nNext step: copy cohort_data.json → app/src/data/cohort_data.json")


# ─────────────────────────────────────────
# Parsing
# ─────────────────────────────────────────

def parse_evaluations(wb: openpyxl.Workbook) -> list[Student]:
    """
    Parse all evaluation sheets and return a list of fully computed Students.

    Expected sheet structure (implement in Week 1):
    - Self-Eval:  rows = [student_id, student_name, team, score_1...score_22]
    - Peer-Eval:  rows = [evaluator_id, subject_id, score_1...score_22, cross_team_flag]
    - Staff-Eval: rows = [evaluator_id, subject_id, score_1...score_22]
    - Gates:      rows = [student_id, sprints_complete, demo_day, negotiation_sim]
    """
    # TODO Week 1: Implement sheet parsing
    # Suggested order:
    # 1. Parse self-eval → dict[student_id → self_scores[22]]
    # 2. Parse peer-eval → dict[student_id → list of peer score rows[22]]
    # 3. Parse staff-eval → dict[student_id → list of staff score rows[22]]
    # 4. Parse gates → dict[student_id → gate booleans]
    # 5. For each student: aggregate → compute → build Student dataclass
    raise NotImplementedError(
        "parse_evaluations not yet implemented. "
        "Start here in Week 1 after confirming .xlsx sheet structure with Ruben."
    )


def safe_float(value) -> float | None:
    """Safely convert a cell value to float; return None if blank or invalid."""
    if value is None or value == "":
        return None
    try:
        return float(value)
    except (ValueError, TypeError):
        return None


def aggregate_scores(
    score_rows: list[list[float | None]],
) -> tuple[list[float], list[int]]:
    """
    Given a list of evaluator rows (each row is 22 scores, some may be None),
    return (avg_per_competency[22], count_per_competency[22]).
    """
    avgs   = []
    counts = []
    for i in range(22):
        col_scores = [row[i] for row in score_rows if row[i] is not None]
        if col_scores:
            avgs.append(round(sum(col_scores) / len(col_scores), 3))
            counts.append(len(col_scores))
        else:
            avgs.append(0.0)
            counts.append(0)
    return avgs, counts


# ─────────────────────────────────────────
# Scoring Computations
# ─────────────────────────────────────────

def compute_cluster_averages(scores: list[float]) -> ClusterAverages:
    """Compute per-cluster averages from a length-22 score array."""
    avgs = [
        round(sum(scores[start:end]) / (end - start), 3)
        for start, end in CLUSTER_BOUNDARIES
    ]
    return ClusterAverages(
        ai_digital=avgs[0],
        product=avgs[1],
        leadership=avgs[2],
        professional=avgs[3],
        community=avgs[4],
    )


def compute_weighted_overall(cluster_avgs: ClusterAverages) -> float:
    """Weighted average across 5 clusters using locked cluster weights."""
    values = [
        cluster_avgs.ai_digital,
        cluster_avgs.product,
        cluster_avgs.leadership,
        cluster_avgs.professional,
        cluster_avgs.community,
    ]
    return round(sum(v * w for v, w in zip(values, CLUSTER_WEIGHTS)), 3)


def compute_certification(
    weighted_overall: float,
    sprints_complete: bool,
    demo_day: bool,
    negotiation_sim: bool,
) -> CertificationRecord:
    """Apply certification business rules."""
    meets_score_bar = weighted_overall >= CERTIFICATION_SCORE_THRESHOLD
    all_gates       = sprints_complete and demo_day and negotiation_sim

    if meets_score_bar and all_gates:
        status = CertificationStatus.CERTIFIED
    elif meets_score_bar and not all_gates:
        status = CertificationStatus.CONDITIONAL
    else:
        status = CertificationStatus.NOT_CERTIFIED

    return CertificationRecord(
        status=status,
        meets_score_bar=meets_score_bar,
        sprints_complete=sprints_complete,
        demo_day=demo_day,
        negotiation_sim=negotiation_sim,
    )


def compute_perception_gaps(
    self_scores: list[float],
    peer_avg:    list[float],
) -> list[PerceptionGapFlag]:
    """Flag competencies where self-score exceeds peer avg by >= threshold."""
    gaps = []
    for comp in COMPETENCIES:
        i   = comp.id - 1
        gap = self_scores[i] - peer_avg[i]
        if gap >= PERCEPTION_GAP_THRESHOLD:
            gaps.append(PerceptionGapFlag(
                competency_id=comp.id,
                competency_name=comp.name,
                self_score=self_scores[i],
                peer_avg=peer_avg[i],
                gap=round(gap, 2),
            ))
    return gaps


def compute_staff_divergence(
    staff_score_rows: list[list[float]],  # shape: [evaluator_count][22]
) -> list[StaffDivergenceFlag]:
    """Flag competencies where 2 staff raters diverge by >= threshold."""
    divergences = []
    for comp in COMPETENCIES:
        i      = comp.id - 1
        scores = [row[i] for row in staff_score_rows if row[i] is not None]
        if len(scores) >= 2:
            div = max(scores) - min(scores)
            if div >= STAFF_DIVERGENCE_THRESHOLD:
                divergences.append(StaffDivergenceFlag(
                    competency_id=comp.id,
                    competency_name=comp.name,
                    staff_scores=scores,
                    divergence=round(div, 2),
                ))
    return divergences


# ─────────────────────────────────────────
# Cohort Analytics
# ─────────────────────────────────────────

def compute_cohort_analytics(students: list[Student]) -> CohortAnalytics:
    """
    Compute program-wide analytics from all student data.
    TODO Week 2: Implement after student data is verified correct.
    """
    # TODO: Implement
    # 1. Average peer_avg scores per competency across all students
    # 2. Rank → strongest 3 (highest avg) and weakest 3 (lowest avg)
    # 3. avg_self_vs_peer_gap = mean of (self_score - peer_avg) across all students × competencies
    # 4. cluster_rankings = sort cluster avgs descending, assign rank 1–5
    raise NotImplementedError("compute_cohort_analytics not yet implemented — build in Week 2")


# ─────────────────────────────────────────
# Run
# ─────────────────────────────────────────

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python etl.py path/to/evaluations.xlsx")
        sys.exit(1)
    main(sys.argv[1])