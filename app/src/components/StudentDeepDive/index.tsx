import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { CertBadge } from "../shared/CertBadge";
import { PerceptionGapFlag } from "../shared/PerceptionGapFlag";
import { ClusterBars } from "../shared/charts/ClusterBars";
import { RadarChart } from "../shared/charts/RadarChart";
import { useCohortData } from "../../hooks/useCohortData";
import { fmt, scoreTextColor, topGrowthAreas, topStrengths } from "../../utils/scoring";
import type { CertificationRecord } from "../../types";
import { StudentPrint } from "./StudentPrint";

interface StudentDeepDiveProps {
  studentId: string | null;
  onBackToCohort: () => void;
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

function ScoreList({
  title,
  items,
  tone,
}: {
  title: string;
  items: { name: string; score: number }[];
  tone: "strength" | "growth";
}) {
  const toneClass =
    tone === "strength"
      ? "border-green-200 bg-green-50 text-green-900"
      : "border-blue-200 bg-blue-50 text-blue-900";

  return (
    <section className={`rounded-lg border p-4 ${toneClass}`}>
      <h2 className="text-sm font-semibold">{title}</h2>
      <ol className="mt-3 space-y-2">
        {items.map((item, index) => (
          <li key={item.name} className="flex items-start justify-between gap-3">
            <span className="text-sm">
              <span className="mr-2 font-semibold tabular-nums">{index + 1}.</span>
              {item.name}
            </span>
            <span className="rounded-full bg-white/80 px-2 py-0.5 text-xs font-semibold tabular-nums">
              {fmt(item.score)}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function StudentDeepDive({ studentId, onBackToCohort }: StudentDeepDiveProps) {
  const { competencies, getStudent, students } = useCohortData();
  const student = studentId ? getStudent(studentId) : students[0];

  if (!student) {
    return (
      <section className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-medium text-gray-500">No student selected.</p>
        <button
          type="button"
          onClick={onBackToCohort}
          className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Back to Cohort
        </button>
      </section>
    );
  }

  const strengths = topStrengths(student, competencies);
  const growthAreas = topGrowthAreas(student, competencies);
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `FLI Credential - ${student.name}`,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBackToCohort}
          className="text-sm font-medium text-indigo-700 hover:text-indigo-900"
        >
          Back to Cohort
        </button>
        <button
          type="button"
          onClick={handlePrint}
          className="rounded-md bg-gray-950 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800"
        >
          Export PDF
        </button>
      </div>

      <div className="fixed left-[-10000px] top-0">
        <div ref={printRef}>
          <StudentPrint
            student={student}
            competencies={competencies}
            strengths={strengths}
            growthAreas={growthAreas}
          />
        </div>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Student Deep Dive
            </p>
            <h1 className="mt-1 text-2xl font-bold text-gray-950">{student.name}</h1>
            <p className="mt-1 text-sm text-gray-500">{student.team}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center">
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="text-xs font-medium text-gray-500">Weighted score</p>
              <p className={`mt-1 text-2xl font-bold tabular-nums ${scoreTextColor(student.weighted_overall)}`}>
                {fmt(student.weighted_overall)}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="mb-2 text-xs font-medium text-gray-500">Certification</p>
              <CertBadge status={student.certification.status} />
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-4">
          {gateItems(student.certification).map((gate) => (
            <div
              key={gate.label}
              className={`rounded-lg border px-3 py-2 text-sm ${
                gate.passed
                  ? "border-green-200 bg-green-50 text-green-800"
                  : "border-red-200 bg-red-50 text-red-800"
              }`}
            >
              <span className="font-semibold">{gate.passed ? "Pass" : "Missing"}</span>
              <span className="ml-2 text-xs">{gate.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(420px,0.85fr)]">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <RadarChart
            studentName={student.name}
            selfScores={student.scores.self_scores}
            peerAvg={student.scores.peer_avg}
            staffAvg={student.scores.staff_avg}
            competencyNames={competencies.map((competency) => competency.name)}
          />
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <ClusterBars clusterAverages={student.cluster_averages} />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <ScoreList title="Top 3 Strengths" items={strengths} tone="strength" />
        <ScoreList title="Top 3 Growth Areas" items={growthAreas} tone="growth" />
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Perception Gap Flags</h2>
            <p className="mt-1 text-xs text-gray-500">
              Competencies where self-score exceeds peer average by at least 1.5.
            </p>
          </div>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
            {student.flags.perception_gaps.length}
          </span>
        </div>
        {student.flags.perception_gaps.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2">
            {student.flags.perception_gaps.map((flag) => (
              <PerceptionGapFlag key={flag.competency_id} flag={flag} />
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500">
            No perception gaps flagged for this student.
          </p>
        )}
      </section>
    </div>
  );
}
