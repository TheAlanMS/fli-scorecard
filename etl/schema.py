"""
FLI Scorecard — Data Schema
============================
Single source of truth for the cohort_data.json structure.

TypeScript mirror: app/src/types/index.ts
Rule: Never change this file without updating the TypeScript mirror.
"""

from dataclasses import dataclass, field
from typing import Optional
from enum import Enum


# ─────────────────────────────────────────
# Enums
# ─────────────────────────────────────────

class CertificationStatus(str, Enum):
    CERTIFIED     = "CERTIFIED"
    CONDITIONAL   = "CONDITIONAL"   # meets score bar but missing a gate
    NOT_CERTIFIED = "NOT_CERTIFIED"


# ─────────────────────────────────────────
# Schema Dataclasses
# ─────────────────────────────────────────

@dataclass
class Competency:
    id:            int
    name:          str
    cluster:       str
    cluster_index: int    # 0–4, maps to CLUSTER_NAMES
    weight:        float  # individual weight in overall score


@dataclass
class PerceptionGapFlag:
    competency_id:   int
    competency_name: str
    self_score:      float
    peer_avg:        float
    gap:             float  # self_score - peer_avg; always >= PERCEPTION_GAP_THRESHOLD


@dataclass
class StaffDivergenceFlag:
    competency_id:   int
    competency_name: str
    staff_scores:    list[float]
    divergence:      float  # max - min; always >= STAFF_DIVERGENCE_THRESHOLD


@dataclass
class StudentScores:
    self_scores:  list[float]  # length 22, index = competency.id - 1
    peer_avg:     list[float]  # length 22; average of 3–4 peer evaluators
    peer_count:   list[int]    # length 22; number of peer scores per competency
    staff_avg:    list[float]  # length 22; average of 2+ staff evaluators
    staff_count:  list[int]    # length 22; number of staff scores per competency


@dataclass
class ClusterAverages:
    ai_digital:   float  # Cluster 1 avg
    product:      float  # Cluster 2 avg
    leadership:   float  # Cluster 3 avg
    professional: float  # Cluster 4 avg
    community:    float  # Cluster 5 avg


@dataclass
class CertificationRecord:
    status:           CertificationStatus
    meets_score_bar:  bool  # weighted_overall >= 3.0
    sprints_complete: bool
    demo_day:         bool
    negotiation_sim:  bool


@dataclass
class StudentFlags:
    perception_gaps:  list[PerceptionGapFlag]
    staff_divergence: list[StaffDivergenceFlag]


@dataclass
class Student:
    id:               str   # "student_1", "student_2", etc.
    name:             str
    team:             str   # "Team A", "Team B", etc.
    scores:           StudentScores
    cluster_averages: ClusterAverages
    weighted_overall: float
    certification:    CertificationRecord
    flags:            StudentFlags


@dataclass
class CohortSummary:
    name:               str    # "Spring 2026 — Brownsville"
    students:           int
    certified:          int
    avg_weighted_score: float


@dataclass
class ClusterRanking:
    cluster:   str
    avg_score: float
    rank:      int   # 1 = highest


@dataclass
class CohortAnalytics:
    strongest_competencies: list[str]           # top 3 by avg peer score
    weakest_competencies:   list[str]           # bottom 3 by avg peer score
    avg_self_vs_peer_gap:   float               # program-wide avg gap
    cluster_rankings:       list[ClusterRanking]


@dataclass
class CohortData:
    cohort:            CohortSummary
    competencies:      list[Competency]
    students:          list[Student]
    cohort_analytics:  CohortAnalytics


# ─────────────────────────────────────────
# Competency Registry (source of truth)
# ─────────────────────────────────────────

CLUSTER_WEIGHTS: list[float] = [0.18, 0.28, 0.27, 0.17, 0.10]

CLUSTER_NAMES: list[str] = [
    "AI & Digital Fluency",
    "Product & Entrepreneurial Thinking",
    "Leadership & Social Influence",
    "Professional Readiness",
    "Community & Social Impact",
]

CLUSTER_KEYS: list[str] = [
    "ai_digital",
    "product",
    "leadership",
    "professional",
    "community",
]

# Cluster boundaries (inclusive start, exclusive end) for indexing into length-22 score arrays
CLUSTER_BOUNDARIES: list[tuple[int, int]] = [
    (0,  4),   # Cluster 1: competencies 1–4
    (4,  10),  # Cluster 2: competencies 5–10
    (10, 16),  # Cluster 3: competencies 11–16
    (16, 20),  # Cluster 4: competencies 17–20
    (20, 22),  # Cluster 5: competencies 21–22
]

def _w(cluster_index: int) -> float:
    """Per-competency weight = cluster weight / number of competencies in cluster."""
    start, end = CLUSTER_BOUNDARIES[cluster_index]
    return round(CLUSTER_WEIGHTS[cluster_index] / (end - start), 6)

COMPETENCIES: list[Competency] = [
    # Cluster 1 — AI & Digital Fluency
    Competency(1,  "AI Literacy & Prompting",              CLUSTER_NAMES[0], 0, _w(0)),
    Competency(2,  "Automation & Workflow Design",          CLUSTER_NAMES[0], 0, _w(0)),
    Competency(3,  "Digital Research & Synthesis",          CLUSTER_NAMES[0], 0, _w(0)),
    Competency(4,  "Data Interpretation & Storytelling",    CLUSTER_NAMES[0], 0, _w(0)),
    # Cluster 2 — Product & Entrepreneurial Thinking
    Competency(5,  "Problem Framing & Root Cause Analysis", CLUSTER_NAMES[1], 1, _w(1)),
    Competency(6,  "Market & User Research",                CLUSTER_NAMES[1], 1, _w(1)),
    Competency(7,  "Product Ideation & MVP Design",         CLUSTER_NAMES[1], 1, _w(1)),
    Competency(8,  "Business Model Thinking",               CLUSTER_NAMES[1], 1, _w(1)),
    Competency(9,  "Execution & Iteration",                 CLUSTER_NAMES[1], 1, _w(1)),
    Competency(10, "Systems Thinking",                      CLUSTER_NAMES[1], 1, _w(1)),
    # Cluster 3 — Leadership & Social Influence
    Competency(11, "Self-Awareness & Emotional Regulation", CLUSTER_NAMES[2], 2, _w(2)),
    Competency(12, "Team Collaboration & Trust-Building",   CLUSTER_NAMES[2], 2, _w(2)),
    Competency(13, "Conflict Navigation & Resolution",      CLUSTER_NAMES[2], 2, _w(2)),
    Competency(14, "Public Speaking & Presentation",        CLUSTER_NAMES[2], 2, _w(2)),
    Competency(15, "Coaching & Mentoring Others",           CLUSTER_NAMES[2], 2, _w(2)),
    Competency(16, "Negotiation & Persuasion",              CLUSTER_NAMES[2], 2, _w(2)),
    # Cluster 4 — Professional Readiness
    Competency(17, "Resume & LinkedIn Presence",            CLUSTER_NAMES[3], 3, _w(3)),
    Competency(18, "Interview Readiness",                   CLUSTER_NAMES[3], 3, _w(3)),
    Competency(19, "Professional Communication",            CLUSTER_NAMES[3], 3, _w(3)),
    Competency(20, "Networking & Relationship Building",    CLUSTER_NAMES[3], 3, _w(3)),
    # Cluster 5 — Community & Social Impact
    Competency(21, "Cultural Competence & Inclusion",       CLUSTER_NAMES[4], 4, _w(4)),
    Competency(22, "Community Problem-Solving",             CLUSTER_NAMES[4], 4, _w(4)),
]

assert len(COMPETENCIES) == 22, "Must have exactly 22 competencies"
assert abs(sum(c.weight for c in COMPETENCIES) - 1.0) < 0.001, "Weights must sum to 1.0"


# ─────────────────────────────────────────
# Business Rule Constants
# ─────────────────────────────────────────

CERTIFICATION_SCORE_THRESHOLD  = 3.0
PERCEPTION_GAP_THRESHOLD       = 1.5  # self - peer_avg >= this → flag
STAFF_DIVERGENCE_THRESHOLD     = 1.5  # max - min staff scores >= this → flag