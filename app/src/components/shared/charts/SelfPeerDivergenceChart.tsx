import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Competency, Student } from "../../../types";

interface SelfPeerDivergenceChartProps {
  students: Student[];
  competencies: Competency[];
}

interface DivergencePoint {
  student: string;
  avgGap: number;
  maxGap: number;
  maxCompetency: string;
}

function averageAbsoluteGap(student: Student): number {
  const gaps = student.scores.self_scores.map((selfScore, index) =>
    Math.abs(selfScore - (student.scores.peer_avg[index] ?? 0))
  );

  if (gaps.length === 0) return 0;

  return gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length;
}

function maxGap(student: Student, competencies: Competency[]) {
  return student.scores.self_scores.reduce(
    (current, selfScore, index) => {
      const gap = Math.abs(selfScore - (student.scores.peer_avg[index] ?? 0));
      if (gap <= current.gap) return current;

      return {
        gap,
        competency: competencies[index]?.name ?? `Competency ${index + 1}`,
      };
    },
    { gap: 0, competency: "No divergence" }
  );
}

export function SelfPeerDivergenceChart({
  students,
  competencies,
}: SelfPeerDivergenceChartProps) {
  const chartData: DivergencePoint[] = students
    .map((student) => {
      const largestGap = maxGap(student, competencies);

      return {
        student: student.name,
        avgGap: Number(averageAbsoluteGap(student).toFixed(2)),
        maxGap: Number(largestGap.gap.toFixed(2)),
        maxCompetency: largestGap.competency,
      };
    })
    .sort((a, b) => b.avgGap - a.avgGap);

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 8, right: 32, bottom: 8, left: 84 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
        <XAxis
          type="number"
          domain={[0, "dataMax"]}
          tick={{ fontSize: 11, fill: "#6b7280" }}
        />
        <YAxis
          type="category"
          dataKey="student"
          width={92}
          tick={{ fontSize: 11, fill: "#374151" }}
        />
        <Tooltip
          cursor={{ fill: "#f3f4f6" }}
          formatter={(value: number | string, name: string) => [
            typeof value === "number" ? value.toFixed(2) : value,
            name === "avgGap" ? "Avg absolute gap" : name,
          ]}
          labelFormatter={(label: string) => {
            const point = chartData.find((item) => item.student === label);
            return point
              ? `${label} - largest gap: ${point.maxGap.toFixed(2)} (${point.maxCompetency})`
              : label;
          }}
        />
        <ReferenceLine x={1.5} stroke="#d97706" strokeDasharray="4 4" />
        <Bar dataKey="avgGap" radius={[0, 4, 4, 0]} barSize={18}>
          {chartData.map((point) => (
            <Cell
              key={point.student}
              fill={point.avgGap >= 1.5 ? "#d97706" : "#4f46e5"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
