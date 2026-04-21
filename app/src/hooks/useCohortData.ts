/**
 * useCohortData
 * =============
 * Loads and memoizes the cohort_data.json file.
 * All screen components must use this hook — never import cohort_data.json directly.
 *
 * In V1, data is static JSON loaded at app startup (no async fetching, no useEffect).
 */

import { useMemo } from "react";
import rawData from "../data/cohort_data.json";
import type { CohortData, Student, Competency } from "../types";

export interface UseCohortDataReturn {
  data:            CohortData;
  students:        Student[];
  competencies:    Competency[];
  getStudent:      (id: string) => Student | undefined;
  certifiedCount:  number;
  totalStudents:   number;
}

export function useCohortData(): UseCohortDataReturn {
  const data = rawData as CohortData;

  const studentMap = useMemo(
    () => new Map(data.students.map((s) => [s.id, s])),
    [data.students]
  );

  return {
    data,
    students:       data.students,
    competencies:   data.competencies,
    getStudent:     (id: string) => studentMap.get(id),
    certifiedCount: data.cohort.certified,
    totalStudents:  data.cohort.students,
  };
}