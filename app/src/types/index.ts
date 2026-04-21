/**
 * FLI Scorecard — TypeScript Types
 * ==================================
 * Mirror of etl/schema.py
 *
 * Rule: Never change this file without updating etl/schema.py to match.
 * The cohort_data.json shape is the contract between ETL and React.
 */

// ─────────────────────────────────────────
// Enums
// ─────────────────────────────────────────

export type CertificationStatus = "CERTIFIED" | "CONDITIONAL" | "NOT_CERTIFIED";

// ─────────────────────────────────────────
// Core Types
// ─────────────────────────────────────────

export interface Competency {
  id:            number;
  name:          string;
  cluster:       string;
  cluster_index: number;  // 0–4
  weight:        number;
}

export interface PerceptionGapFlag {
  competency_id:   number;
  competency_name: string;
  self_score:      number;
  peer_avg:        number;
  gap:             number;  // self_score - peer_avg; always >= 1.5
}

export interface StaffDivergenceFlag {
  competency_id:   number;
  competency_name: string;
  staff_scores:    number[];
  divergence:      number;  // max - min; always >= 1.5
}

export interface StudentScores {
  self_scores:  number[];  // length 22, index = competency.id - 1
  peer_avg:     number[];  // length 22
  peer_count:   number[];  // length 22
  staff_avg:    number[];  // length 22
  staff_count:  number[];  // length 22
}

export interface ClusterAverages {
  ai_digital:   number;
  product:      number;
  leadership:   number;
  professional: number;
  community:    number;
}

export interface CertificationRecord {
  status:           CertificationStatus;
  meets_score_bar:  boolean;
  sprints_complete: boolean;
  demo_day:         boolean;
  negotiation_sim:  boolean;
}

export interface StudentFlags {
  perception_gaps:  PerceptionGapFlag[];
  staff_divergence: StaffDivergenceFlag[];
}

export interface Student {
  id:               string;  // "student_1", etc.
  name:             string;
  team:             string;
  scores:           StudentScores;
  cluster_averages: ClusterAverages;
  weighted_overall: number;
  certification:    CertificationRecord;
  flags:            StudentFlags;
}

export interface CohortSummary {
  name:               string;
  students:           number;
  certified:          number;
  avg_weighted_score: number;
}

export interface ClusterRanking {
  cluster:   string;
  avg_score: number;
  rank:      number;  // 1 = highest
}

export interface CohortAnalytics {
  strongest_competencies: string[];
  weakest_competencies:   string[];
  avg_self_vs_peer_gap:   number;
  cluster_rankings:       ClusterRanking[];
}

export interface CohortData {
  cohort:           CohortSummary;
  competencies:     Competency[];
  students:         Student[];
  cohort_analytics: CohortAnalytics;
}

// ─────────────────────────────────────────
// Constants (mirror of schema.py)
// ─────────────────────────────────────────

export const CLUSTER_WEIGHTS = [0.18, 0.28, 0.27, 0.17, 0.10] as const;

export const CLUSTER_NAMES = [
  "AI & Digital Fluency",
  "Product & Entrepreneurial Thinking",
  "Leadership & Social Influence",
  "Professional Readiness",
  "Community & Social Impact",
] as const;

export const CLUSTER_KEYS: (keyof ClusterAverages)[] = [
  "ai_digital",
  "product",
  "leadership",
  "professional",
  "community",
];

export const CLUSTER_DISPLAY_NAMES: Record<keyof ClusterAverages, string> = {
  ai_digital:   "AI & Digital Fluency",
  product:      "Product & Entrepreneurial",
  leadership:   "Leadership & Social",
  professional: "Professional Readiness",
  community:    "Community & Impact",
};

// Certification thresholds (match schema.py constants exactly)
export const CERTIFICATION_SCORE_THRESHOLD = 3.0;
export const PERCEPTION_GAP_THRESHOLD      = 1.5;
export const STAFF_DIVERGENCE_THRESHOLD    = 1.5;

// Score display colors (used in CertBadge and heatmap)
export const SCORE_COLOR = {
  high:   "text-green-600",   // >= 3.5
  mid:    "text-yellow-600",  // 2.5–3.49
  low:    "text-red-600",     // < 2.5
} as const;

export const CERT_STATUS_COLOR: Record<CertificationStatus, string> = {
  CERTIFIED:     "bg-green-100 text-green-800 border-green-300",
  CONDITIONAL:   "bg-yellow-100 text-yellow-800 border-yellow-300",
  NOT_CERTIFIED: "bg-red-100 text-red-800 border-red-300",
};