/**
 * Scoring Utilities
 * =================
 * Score formatting, color thresholds, and display helpers.
 * Business rule constants live in types/index.ts — import from there.
 */

import type { ClusterAverages, CertificationStatus, Student } from "../types";
import {
  CLUSTER_KEYS,
  CERTIFICATION_SCORE_THRESHOLD,
} from "../types";

export interface ScoreListItem {
  name: string;
  score: number | null;
}

/** True when a runtime score is numeric and within the 1-5 rubric range. */
export function isTrustedScore(score: unknown): score is number {
  return typeof score === "number" && Number.isFinite(score) && score >= 1 && score <= 5;
}

/** Return a trusted score for charting, or null so Recharts treats the point as missing. */
export function scoreOrNull(score: unknown): number | null {
  return isTrustedScore(score) ? score : null;
}

/** Return a trusted score for sorting, pushing missing values to the end. */
export function scoreForSort(score: unknown): number {
  return isTrustedScore(score) ? score : Number.NEGATIVE_INFINITY;
}

/** Format a score to 1 decimal place for display, or N/A when missing/untrusted. */
export function fmt(score: unknown): string {
  return isTrustedScore(score) ? score.toFixed(1) : "N/A";
}

/** Tailwind bg color class for a heatmap cell based on score value */
export function heatmapColor(score: unknown): string {
  if (!isTrustedScore(score)) return "bg-gray-100 text-gray-500";
  if (score >= 4.0) return "bg-green-600 text-white";
  if (score >= 3.5) return "bg-green-400 text-white";
  if (score >= 3.0) return "bg-yellow-300 text-gray-900";
  if (score >= 2.5) return "bg-orange-300 text-gray-900";
  return "bg-red-500 text-white";
}

/** Tailwind text color class for an inline score display */
export function scoreTextColor(score: unknown): string {
  if (!isTrustedScore(score)) return "text-gray-500";
  if (score >= 3.5) return "text-green-600";
  if (score >= 2.5) return "text-yellow-600";
  return "text-red-600";
}

/** True if this score qualifies as meeting the certification bar */
export function meetsBar(score: number): boolean {
  return score >= CERTIFICATION_SCORE_THRESHOLD;
}

/** Extract cluster averages as an ordered array matching CLUSTER_KEYS order */
export function clusterAveragesArray(ca: ClusterAverages): number[] {
  return CLUSTER_KEYS.map((key) => ca[key]);
}

/** Get top N strengths from a student (by peer_avg score) */
export function topStrengths(
  student: Student,
  competencies: { id: number; name: string }[],
  n = 3
): ScoreListItem[] {
  return [...competencies]
    .filter((competency) => isTrustedScore(student.scores.peer_avg[competency.id - 1]))
    .sort(
      (a, b) =>
        scoreForSort(student.scores.peer_avg[b.id - 1]) -
        scoreForSort(student.scores.peer_avg[a.id - 1])
    )
    .slice(0, n)
    .map((c) => ({ name: c.name, score: scoreOrNull(student.scores.peer_avg[c.id - 1]) }));
}

/** Get top N growth areas from a student (by lowest peer_avg score) */
export function topGrowthAreas(
  student: Student,
  competencies: { id: number; name: string }[],
  n = 3
): ScoreListItem[] {
  return [...competencies]
    .filter((competency) => isTrustedScore(student.scores.peer_avg[competency.id - 1]))
    .sort(
      (a, b) =>
        scoreForSort(student.scores.peer_avg[a.id - 1]) -
        scoreForSort(student.scores.peer_avg[b.id - 1])
    )
    .slice(0, n)
    .map((c) => ({ name: c.name, score: scoreOrNull(student.scores.peer_avg[c.id - 1]) }));
}

/** Human-readable label for certification status */
export function certLabel(status: CertificationStatus): string {
  switch (status) {
    case "CERTIFIED":     return "Certified";
    case "CONDITIONAL":   return "Conditional";
    case "NOT_CERTIFIED": return "Not Certified";
  }
}
