import { useState } from "react";
import { useCohortData } from "../../hooks/useCohortData";
import { CertBadge } from "../shared/CertBadge";
import { fmt, scoreTextColor } from "../../utils/scoring";
import type { Student } from "../../types";

type SortField = "weighted_overall" | "name" | "team";
type SortDir   = "asc" | "desc";

interface CohortTableProps {
  onSelectStudent: (studentId: string) => void;
}

function sortIndicator(field: SortField, active: SortField, dir: SortDir) {
  if (field !== active) return <span className="ml-1 text-gray-300">↕</span>;
  return (
    <span className="ml-1 text-indigo-500">{dir === "asc" ? "↑" : "↓"}</span>
  );
}

export function CohortTable({ onSelectStudent }: CohortTableProps) {
  const { students, data } = useCohortData();

  const [sortField, setSortField] = useState<SortField>("weighted_overall");
  const [sortDir,   setSortDir]   = useState<SortDir>("desc");

  function handleSort(field: SortField) {
    if (field === sortField) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir(field === "weighted_overall" ? "desc" : "asc");
    }
  }

  const sorted = [...students].sort((a: Student, b: Student) => {
    let cmp = 0;
    if (sortField === "weighted_overall") {
      cmp = a.weighted_overall - b.weighted_overall;
    } else if (sortField === "name") {
      cmp = a.name.localeCompare(b.name);
    } else {
      cmp = a.team.localeCompare(b.team);
    }
    return sortDir === "asc" ? cmp : -cmp;
  });

  const thBase =
    "px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider " +
    "cursor-pointer select-none hover:text-gray-800 transition-colors";
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Cohort Command Center</h1>
        <p className="mt-1 text-sm text-gray-500">
          {data.cohort.name}&ensp;·&ensp;
          <span className="text-green-600 font-medium">{data.cohort.certified} certified</span>
          &ensp;of&ensp;
          {data.cohort.students} students&ensp;·&ensp;
          cohort avg&ensp;
          <span className={`font-semibold ${scoreTextColor(data.cohort.avg_weighted_score)}`}>
            {fmt(data.cohort.avg_weighted_score)}
          </span>
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className={thBase}
                onClick={() => handleSort("name")}
              >
                Name {sortIndicator("name", sortField, sortDir)}
              </th>
              <th
                className={thBase}
                onClick={() => handleSort("team")}
              >
                Team {sortIndicator("team", sortField, sortDir)}
              </th>
              <th
                className={thBase}
                onClick={() => handleSort("weighted_overall")}
              >
                Score {sortIndicator("weighted_overall", sortField, sortDir)}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Flags
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {sorted.map((student) => (
              <tr
                key={student.id}
                onClick={() => onSelectStudent(student.id)}
                className="hover:bg-indigo-50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {student.name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {student.team}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`font-semibold tabular-nums ${scoreTextColor(
                      student.weighted_overall
                    )}`}
                  >
                    {fmt(student.weighted_overall)}
                  </span>
                  <span className="text-gray-300 ml-1 text-xs">/ 5.0</span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <CertBadge status={student.certification.status} />
                </td>
                <td className="px-4 py-3 text-sm">
                  {student.flags.perception_gaps.length > 0 && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-0.5">
                      &#9873;&ensp;{student.flags.perception_gaps.length}&ensp;
                      {student.flags.perception_gaps.length === 1
                        ? "gap"
                        : "gaps"}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-gray-400">
        Click any row to open the Student Deep Dive.
      </p>
    </div>
  );
}
