import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ClusterAverages } from "../../../types";
import { CERTIFICATION_SCORE_THRESHOLD, CLUSTER_DISPLAY_NAMES, CLUSTER_KEYS } from "../../../types";
import { fmt, scoreOrNull } from "../../../utils/scoring";

interface ClusterBarsProps {
  clusterAverages: ClusterAverages;
}

interface ClusterBarPoint {
  cluster: string;
  score: number | null;
}

export function ClusterBars({ clusterAverages }: ClusterBarsProps) {
  const chartData: ClusterBarPoint[] = CLUSTER_KEYS.map((key) => ({
    cluster: CLUSTER_DISPLAY_NAMES[key],
    score: scoreOrNull(clusterAverages[key]),
  }));

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Cluster Profile</h2>
          <p className="mt-1 text-xs text-gray-500">
            Five weighted competency clusters with certification bar at 3.0.
          </p>
        </div>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
          Threshold {fmt(CERTIFICATION_SCORE_THRESHOLD)}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={chartData}
          margin={{ top: 8, right: 16, bottom: 44, left: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis
            dataKey="cluster"
            interval={0}
            tick={{ fontSize: 11, fill: "#4b5563" }}
            angle={-18}
            textAnchor="end"
            height={58}
          />
          <YAxis
            domain={[0, 5]}
            ticks={[0, 1, 2, 3, 4, 5]}
            tick={{ fontSize: 11, fill: "#6b7280" }}
            width={32}
          />
          <Tooltip
            formatter={(value: number | string) =>
              typeof value === "number" ? [fmt(value), "Score"] : [value, "Score"]
            }
          />
          <ReferenceLine
            y={CERTIFICATION_SCORE_THRESHOLD}
            stroke="#f59e0b"
            strokeDasharray="5 5"
            label={{ value: "3.0 bar", position: "insideTopRight", fill: "#92400e", fontSize: 11 }}
          />
          <Bar dataKey="score" fill="#2563eb" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
