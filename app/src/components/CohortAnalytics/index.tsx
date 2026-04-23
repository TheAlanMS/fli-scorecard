import { useCohortData } from "../../hooks/useCohortData";
import { fmt, scoreTextColor } from "../../utils/scoring";
import { CohortHeatmap } from "../shared/charts/CohortHeatmap";
import { SelfPeerDivergenceChart } from "../shared/charts/SelfPeerDivergenceChart";

interface SummaryCardProps {
  label: string;
  value: string;
  detail: string;
}

function SummaryCard({ label, value, detail }: SummaryCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
      <p className="mt-1 text-sm text-gray-500">{detail}</p>
    </div>
  );
}

function CompetencyList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "strength" | "growth";
}) {
  const badgeClass =
    tone === "strength"
      ? "bg-green-50 text-green-700 border-green-200"
      : "bg-amber-50 text-amber-700 border-amber-200";

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <ol className="mt-3 space-y-2">
        {items.map((item, index) => (
          <li
            key={item}
            className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
          >
            <span
              className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${badgeClass}`}
            >
              {index + 1}
            </span>
            <span className="text-sm text-gray-700">{item}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function CohortAnalytics() {
  const { data, students, competencies, certifiedCount, totalStudents } =
    useCohortData();

  const certifiedRate =
    totalStudents > 0 ? Math.round((certifiedCount / totalStudents) * 100) : 0;
  const conditionalCount = students.filter(
    (student) => student.certification.status === "CONDITIONAL"
  ).length;
  const perceptionGapCount = students.reduce(
    (count, student) => count + student.flags.perception_gaps.length,
    0
  );
  const strongestCluster = data.cohort_analytics.cluster_rankings[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cohort Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">
          {data.cohort.name} - cohort-level competency patterns and calibration signals
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Cohort Average"
          value={fmt(data.cohort.avg_weighted_score)}
          detail="weighted score across all students"
        />
        <SummaryCard
          label="Certified"
          value={`${certifiedCount}/${totalStudents}`}
          detail={`${certifiedRate}% certified; ${conditionalCount} conditional`}
        />
        <SummaryCard
          label="Avg Self-Peer Gap"
          value={fmt(data.cohort_analytics.avg_self_vs_peer_gap)}
          detail="from cohort analytics output"
        />
        <SummaryCard
          label="Top Cluster"
          value={strongestCluster ? fmt(strongestCluster.avg_score) : "-"}
          detail={strongestCluster?.cluster ?? "No ranking available"}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Student x Cluster Heatmap
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Peer-weighted cluster averages sorted by overall score.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="h-3 w-3 rounded-sm bg-red-500" />
              <span>Lower</span>
              <span className="h-3 w-3 rounded-sm bg-yellow-300" />
              <span>3.0 bar</span>
              <span className="h-3 w-3 rounded-sm bg-green-600" />
              <span>Higher</span>
            </div>
          </div>
          <CohortHeatmap students={students} />
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">
            Competency Signals
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Strongest and weakest competencies from cohort analytics.
          </p>
          <div className="mt-5 grid gap-6">
            <CompetencyList
              title="Strongest Competencies"
              items={data.cohort_analytics.strongest_competencies}
              tone="strength"
            />
            <CompetencyList
              title="Weakest Competencies"
              items={data.cohort_analytics.weakest_competencies}
              tone="growth"
            />
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-gray-900">
              Self vs. Peer Divergence
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Average absolute self-peer gap by student, computed from existing score arrays.
            </p>
          </div>
          <SelfPeerDivergenceChart
            students={students}
            competencies={competencies}
          />
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">
            Cluster Rankings
          </h2>
          <div className="mt-4 space-y-3">
            {data.cohort_analytics.cluster_rankings.map((cluster) => (
              <div
                key={cluster.cluster}
                className="flex items-center justify-between gap-4 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {cluster.cluster}
                  </p>
                  <p className="text-xs text-gray-500">Rank {cluster.rank}</p>
                </div>
                <span
                  className={`text-sm font-semibold tabular-nums ${scoreTextColor(
                    cluster.avg_score
                  )}`}
                >
                  {fmt(cluster.avg_score)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            {perceptionGapCount} perception gap
            {perceptionGapCount === 1 ? "" : "s"} currently flagged across the cohort.
          </div>
        </div>
      </section>
    </div>
  );
}
