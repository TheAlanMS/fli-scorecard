import { CertBadge } from "../shared/CertBadge";
import { fmt } from "../../utils/scoring";
import type { CertificationRecord, ClusterAverages, Competency, Student } from "../../types";
import { CLUSTER_DISPLAY_NAMES, CLUSTER_KEYS } from "../../types";

interface StudentPrintProps {
  student: Student;
  competencies: Competency[];
  strengths: { name: string; score: number }[];
  growthAreas: { name: string; score: number }[];
}

interface GateItem {
  label: string;
  passed: boolean;
}

function gateItems(certification: CertificationRecord): GateItem[] {
  return [
    { label: "Score bar", passed: certification.meets_score_bar },
    { label: "Sprints complete", passed: certification.sprints_complete },
    { label: "Demo day", passed: certification.demo_day },
    { label: "Negotiation sim", passed: certification.negotiation_sim },
  ];
}

function clusterRows(clusterAverages: ClusterAverages) {
  return CLUSTER_KEYS.map((key) => ({
    key,
    label: CLUSTER_DISPLAY_NAMES[key],
    score: clusterAverages[key],
  }));
}

export function StudentPrint({
  student,
  competencies,
  strengths,
  growthAreas,
}: StudentPrintProps) {
  const gapCompetencyIds = new Set(
    student.flags.perception_gaps.map((gap) => gap.competency_id)
  );
  const calibrationRows = competencies
    .filter((competency) => gapCompetencyIds.has(competency.id))
    .slice(0, 4);

  return (
    <article className="min-h-[11in] w-[8.5in] bg-white px-[0.55in] py-[0.45in] text-gray-950">
      <header className="border-b-4 border-gray-950 pb-5">
        <div className="flex items-start justify-between gap-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
              Frontera Leadership Institute
            </p>
            <h1 className="mt-3 text-4xl font-black leading-none">{student.name}</h1>
            <p className="mt-2 text-base font-semibold text-gray-600">{student.team}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-gray-500">
              Weighted Score
            </p>
            <p className="mt-1 text-5xl font-black tabular-nums">
              {fmt(student.weighted_overall)}
            </p>
            <div className="mt-3 flex justify-end">
              <CertBadge status={student.certification.status} />
            </div>
          </div>
        </div>
      </header>

      <section className="mt-6 grid grid-cols-4 gap-3">
        {gateItems(student.certification).map((gate) => (
          <div
            key={gate.label}
            className={`border px-3 py-3 ${
              gate.passed
                ? "border-green-300 bg-green-50 text-green-900"
                : "border-red-300 bg-red-50 text-red-900"
            }`}
          >
            <p className="text-lg font-black">{gate.passed ? "PASS" : "OPEN"}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide">{gate.label}</p>
          </div>
        ))}
      </section>

      <section className="mt-7 grid grid-cols-[1.1fr_0.9fr] gap-6">
        <div>
          <h2 className="border-b border-gray-300 pb-2 text-sm font-black uppercase tracking-[0.14em]">
            Cluster Averages
          </h2>
          <div className="mt-4 space-y-3">
            {clusterRows(student.cluster_averages).map((cluster) => (
              <div key={cluster.key} className="grid grid-cols-[1fr_3.5rem] items-center gap-3">
                <span className="text-sm font-semibold">{cluster.label}</span>
                <span className="border border-gray-300 bg-gray-50 px-2 py-1 text-center text-sm font-black tabular-nums">
                  {fmt(cluster.score)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-gray-300 p-4">
          <h2 className="text-sm font-black uppercase tracking-[0.14em]">
            Credential Summary
          </h2>
          <p className="mt-4 text-sm leading-6 text-gray-700">
            This credential summarizes competency evidence from self, peer, and staff
            evaluations using the FLI weighted competency model.
          </p>
          <div className="mt-5 border-t border-gray-200 pt-4">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
              Calibration Flags
            </p>
            <p className="mt-1 text-3xl font-black tabular-nums">
              {student.flags.perception_gaps.length}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-7 grid grid-cols-2 gap-6">
        <div>
          <h2 className="border-b border-green-300 pb-2 text-sm font-black uppercase tracking-[0.14em] text-green-900">
            Top Strengths
          </h2>
          <ol className="mt-3 space-y-2">
            {strengths.map((item, index) => (
              <li key={item.name} className="flex justify-between gap-4 text-sm">
                <span>
                  <span className="mr-2 font-black tabular-nums">{index + 1}.</span>
                  {item.name}
                </span>
                <span className="font-black tabular-nums">{fmt(item.score)}</span>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <h2 className="border-b border-blue-300 pb-2 text-sm font-black uppercase tracking-[0.14em] text-blue-900">
            Growth Areas
          </h2>
          <ol className="mt-3 space-y-2">
            {growthAreas.map((item, index) => (
              <li key={item.name} className="flex justify-between gap-4 text-sm">
                <span>
                  <span className="mr-2 font-black tabular-nums">{index + 1}.</span>
                  {item.name}
                </span>
                <span className="font-black tabular-nums">{fmt(item.score)}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mt-7">
        <h2 className="border-b border-amber-300 pb-2 text-sm font-black uppercase tracking-[0.14em] text-amber-900">
          Perception Gap Flags
        </h2>
        {student.flags.perception_gaps.length > 0 ? (
          <div className="mt-3 grid grid-cols-2 gap-3">
            {calibrationRows.map((competency) => {
              const flag = student.flags.perception_gaps.find(
                (gap) => gap.competency_id === competency.id
              );
              return flag ? (
                <div key={flag.competency_id} className="border border-amber-200 bg-amber-50 p-3">
                  <p className="text-xs font-black uppercase tracking-wide text-amber-900">
                    {flag.competency_name}
                  </p>
                  <p className="mt-2 text-sm text-amber-900">
                    Self {fmt(flag.self_score)} / Peer {fmt(flag.peer_avg)} / Gap{" "}
                    {fmt(flag.gap)}
                  </p>
                </div>
              ) : null;
            })}
          </div>
        ) : (
          <p className="mt-3 border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600">
            No perception gaps flagged for this student.
          </p>
        )}
      </section>
    </article>
  );
}
