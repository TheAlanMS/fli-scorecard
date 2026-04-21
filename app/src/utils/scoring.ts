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

/** Format a score to 1 decimal place for display */
export function fmt(score: number): string {
  return score.toFixed(1);
}

/** Tailwind bg color class for a heatmap cell based on score value */
export function heatmapColor(score: number): string {
  if (score >= 4.0) return "bg-green-600 text-white";
  if (score >= 3.5) return "bg-green-400 text-white";
  if (score >= 3.0) return "bg-yellow-300 text-gray-900";
  if (score >= 2.5) return "bg-orange-300 text-gray-900";
  return "bg-red-500 text-white";
}

/** Tailwind text color class for an inline score display */
export function scoreTextColor(score: number): string {
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
export function topStrengths(student: Student, competencies: { id: number; name: string }[], n = 3) {
  return [...competencies]
    .sort((a, b) => student.scores.peer_avg[b.id - 1] - student.scores.peer_avg[a.id - 1])
    .slice(0, n)
    .map((c) => ({ name: c.name, score: student.scores.peer_avg[c.id - 1] }));
}

/** Get top N growth areas from a student (by lowest peer_avg score) */
export function topGrowthAreas(student: Student, competencies: { id: number; name: string }[], n = 3) {
  return [...competencies]
    .sort((a, b) => student.scores.peer_avg[a.id - 1] - student.scores.peer_avg[b.id - 1])
    .slice(0, n)
    .map((c) => ({ name: c.name, score: student.scores.peer_avg[c.id - 1] }));
}

/** Human-readable label for certification status */
export function certLabel(status: CertificationStatus): string {
  switch (status) {
    case "CERTIFIED":     return "Certified";
    case "CONDITIONAL":   return "Conditional";
    case "NOT_CERTIFIED": return "Not Certified";
  }
}