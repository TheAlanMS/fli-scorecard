import { fmt, heatmapColor } from "../../utils/scoring";
import type { CohortData, Student } from "../../types";
import { CLUSTER_DISPLAY_NAMES, CLUSTER_KEYS } from "../../types";

interface CohortPrintProps {
  data: CohortData;
  students: Student[];
  certifiedCount: number;
  totalStudents: number;
  conditionalCount: number;
  perceptionGapCount: number;
}

function averageSelfPeerGap(student: Student): number {
  const gaps = student.scores.self_scores.map((score, index) =>
    Math.abs(score - student.scores.peer_avg[index])
  );
  return gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length;
}

function certificationRate(certifiedCount: number, totalStudents: number): number {
  return totalStudents > 0 ? Math.round((certifiedCount / totalStudents) * 100) : 0;
}

export function CohortPrint({
  data,
  students,
  certifiedCount,
  totalStudents,
  conditionalCount,
  perceptionGapCount,
}: CohortPrintProps) {
  const sortedStudents = [...students].sort(
    (a, b) => b.weighted_overall - a.weighted_overall
  );
  const divergenceHighlights = [...students]
    .map((student) => ({
      student,
      gap: averageSelfPeerGap(student),
    }))
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 5);

  return (
    <article className="min-h-[11in] w-[8.5in] bg-white px-[0.45in] py-[0.4in] text-gray-950">
      <header className="border-b-4 border-gray-950 pb-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
          Frontera Leadership Institute
        </p>
        <div className="mt-3 flex items-end justify-between gap-8">
          <div>
            <h1 className="text-4xl font-black leading-none">Cohort Impact Report</h1>
            <p className="mt-2 text-base font-semibold text-gray-600">{data.cohort.name}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-gray-500">
              Cohort Average
            </p>
            <p className="mt-1 text-5xl font-black tabular-nums">
              {fmt(data.cohort.avg_weighted_score)}
            </p>
          </div>
        </div>
      </header>

      <section className="mt-6 grid grid-cols-4 gap-3">
        <div className="border border-gray-300 p-3">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Students</p>
          <p className="mt-2 text-3xl font-black tabular-nums">{totalStudents}</p>
        </div>
        <div className="border border-green-300 bg-green-50 p-3">
          <p className="text-xs font-bold uppercase tracking-wide text-green-900">Certified</p>
          <p className="mt-2 text-3xl font-black tabular-nums">
            {certifiedCount}/{totalStudents}
          </p>
        </div>
        <div className="border border-yellow-300 bg-yellow-50 p-3">
          <p className="text-xs font-bold uppercase tracking-wide text-yellow-900">Cert Rate</p>
          <p className="mt-2 text-3xl font-black tabular-nums">
            {certificationRate(certifiedCount, totalStudents)}%
          </p>
        </div>
        <div className="border border-amber-300 bg-amber-50 p-3">
          <p className="text-xs font-bold uppercase tracking-wide text-amber-900">Gap Flags</p>
          <p className="mt-2 text-3xl font-black tabular-nums">{perceptionGapCount}</p>
        </div>
      </section>

      <section className="mt-7 grid grid-cols-[1fr_1fr] gap-6">
        <div>
          <h2 className="border-b border-green-300 pb-2 text-sm font-black uppercase tracking-[0.14em] text-green-900">
            Strongest Competencies
          </h2>
          <ol className="mt-3 space-y-2">
            {data.cohort_analytics.strongest_competencies.map((competency, index) => (
              <li key={competency} className="flex gap-3 text-sm">
                <span className="font-black tabular-nums">{index + 1}.</span>
                <span>{competency}</span>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h2 className="border-b border-blue-300 pb-2 text-sm font-black uppercase tracking-[0.14em] text-blue-900">
            Weakest Competencies
          </h2>
          <ol className="mt-3 space-y-2">
            {data.cohort_analytics.weakest_competencies.map((competency, index) => (
              <li key={competency} className="flex gap-3 text-sm">
                <span className="font-black tabular-nums">{index + 1}.</span>
                <span>{competency}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mt-7">
        <h2 className="border-b border-gray-300 pb-2 text-sm font-black uppercase tracking-[0.14em]">
          Cluster Rankings
        </h2>
        <div className="mt-3 grid grid-cols-5 gap-2">
          {data.cohort_analytics.cluster_rankings.map((cluster) => (
            <div key={cluster.cluster} className="border border-gray-300 p-3">
              <p className="text-xs font-black uppercase tracking-wide text-gray-500">
                Rank {cluster.rank}
              </p>
              <p className="mt-2 min-h-10 text-sm font-bold leading-tight">{cluster.cluster}</p>
              <p className="mt-2 text-xl font-black tabular-nums">{fmt(cluster.avg_score)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-7">
        <h2 className="border-b border-gray-300 pb-2 text-sm font-black uppercase tracking-[0.14em]">
          Student x Cluster Summary
        </h2>
        <div className="mt-3 grid grid-cols-[1.35fr_repeat(5,0.55fr)_0.55fr] gap-1 text-[10px]">
          <div className="font-black uppercase tracking-wide text-gray-500">Student</div>
          {CLUSTER_KEYS.map((key) => (
            <div key={key} className="font-black uppercase tracking-wide text-gray-500">
              {CLUSTER_DISPLAY_NAMES[key].split(" ")[0]}
            </div>
          ))}
          <div className="font-black uppercase tracking-wide text-gray-500">Total</div>
          {sortedStudents.map((student) => (
            <div key={student.id} className="contents">
              <div className="truncate border border-gray-200 px-2 py-1 font-semibold">
                {student.name}
              </div>
              {CLUSTER_KEYS.map((key) => (
                <div
                  key={`${student.id}-${key}`}
                  className={`border px-1 py-1 text-center font-black tabular-nums ${heatmapColor(
                    student.cluster_averages[key]
                  )}`}
                >
                  {fmt(student.cluster_averages[key])}
                </div>
              ))}
              <div className="border border-gray-300 px-1 py-1 text-center font-black tabular-nums">
                {fmt(student.weighted_overall)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-7 grid grid-cols-[1fr_1fr] gap-6">
        <div>
          <h2 className="border-b border-amber-300 pb-2 text-sm font-black uppercase tracking-[0.14em] text-amber-900">
            Self-Peer Divergence Highlights
          </h2>
          <ol className="mt-3 space-y-2">
            {divergenceHighlights.map(({ student, gap }, index) => (
              <li key={student.id} className="flex justify-between gap-4 text-sm">
                <span>
                  <span className="mr-2 font-black tabular-nums">{index + 1}.</span>
                  {student.name}
                </span>
                <span className="font-black tabular-nums">{fmt(gap)}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="border border-gray-300 p-4">
          <h2 className="text-sm font-black uppercase tracking-[0.14em]">
            Certification Notes
          </h2>
          <p className="mt-3 text-sm leading-6 text-gray-700">
            {conditionalCount} student{conditionalCount === 1 ? "" : "s"} are conditional.
            Final credential delivery should confirm all sprint, demo day, and negotiation
            simulation gates before export.
          </p>
        </div>
      </section>
    </article>
  );
}
