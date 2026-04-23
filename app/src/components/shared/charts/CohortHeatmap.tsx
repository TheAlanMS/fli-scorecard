import { CLUSTER_DISPLAY_NAMES, CLUSTER_KEYS } from "../../../types";
import type { Student } from "../../../types";
import { fmt, heatmapColor } from "../../../utils/scoring";

interface CohortHeatmapProps {
  students: Student[];
}

export function CohortHeatmap({ students }: CohortHeatmapProps) {
  const orderedStudents = [...students].sort(
    (a, b) => b.weighted_overall - a.weighted_overall
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-0">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 bg-white px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              Student
            </th>
            {CLUSTER_KEYS.map((key) => (
              <th
                key={key}
                className="min-w-[8rem] px-2 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                {CLUSTER_DISPLAY_NAMES[key]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orderedStudents.map((student) => (
            <tr key={student.id}>
              <td className="sticky left-0 z-10 border-t border-gray-100 bg-white px-3 py-2 text-sm font-medium text-gray-900">
                <div>{student.name}</div>
                <div className="text-xs font-normal text-gray-400">{student.team}</div>
              </td>
              {CLUSTER_KEYS.map((key) => {
                const score = student.cluster_averages[key];

                return (
                  <td key={key} className="border-t border-gray-100 px-2 py-2">
                    <div
                      className={`flex h-11 items-center justify-center rounded-md text-sm font-semibold tabular-nums ${heatmapColor(
                        score
                      )}`}
                      title={`${student.name}: ${CLUSTER_DISPLAY_NAMES[key]} ${fmt(score)}`}
                    >
                      {fmt(score)}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
