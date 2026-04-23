import {
  RadarChart as RechartsRadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { scoreOrNull } from "../../../utils/scoring";

interface RadarChartProps {
  studentName:     string;
  selfScores:      number[];
  peerAvg:         number[];
  staffAvg:        number[];
  competencyNames: string[];
}

interface RadarDataPoint {
  subject:  string;
  fullName: string;
  self:     number | null;
  peer:     number | null;
  staff:    number | null;
}

export function RadarChart({
  studentName,
  selfScores,
  peerAvg,
  staffAvg,
  competencyNames,
}: RadarChartProps) {
  const chartData: RadarDataPoint[] = competencyNames.map((name, i) => ({
    subject:  `C${i + 1}`,
    fullName: name,
    self:     scoreOrNull(selfScores[i]),
    peer:     scoreOrNull(peerAvg[i]),
    staff:    scoreOrNull(staffAvg[i]),
  }));

  return (
    <div>
      <p className="text-sm font-semibold text-gray-700 mb-1">
        {studentName} — Competency Radar
      </p>
      <p className="text-xs text-gray-400 mb-3">
        C1–C22 map to competency IDs; hover for label
      </p>
      <ResponsiveContainer width="100%" height={420}>
        <RechartsRadarChart
          data={chartData}
          margin={{ top: 20, right: 40, bottom: 20, left: 40 }}
        >
          <PolarGrid gridType="polygon" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fontSize: 10, fill: "#6b7280" }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 5]}
            tickCount={6}
            tick={{ fontSize: 9, fill: "#9ca3af" }}
          />
          <Radar
            name="Self"
            dataKey="self"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.1}
            strokeWidth={2}
          />
          <Radar
            name="Peer"
            dataKey="peer"
            stroke="#22c55e"
            fill="#22c55e"
            fillOpacity={0.1}
            strokeWidth={2}
          />
          <Radar
            name="Staff"
            dataKey="staff"
            stroke="#a855f7"
            fill="#a855f7"
            fillOpacity={0.1}
            strokeWidth={2}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value: number | string) =>
              typeof value === "number" ? value.toFixed(1) : value
            }
            labelFormatter={(label: string) => {
              const point = chartData.find((d) => d.subject === label);
              return point ? point.fullName : label;
            }}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
