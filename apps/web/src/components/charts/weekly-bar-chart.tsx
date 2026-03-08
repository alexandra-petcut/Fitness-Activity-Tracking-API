"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface WeeklyBarChartProps {
  data: { label: string; value: number }[];
  color?: string;
  unit?: string;
  height?: number;
}

export function WeeklyBarChart({
  data,
  color = "#f97316",
  unit = "km",
  height = 240,
}: WeeklyBarChartProps) {
  return (
    <div className="rounded-xl border border-border bg-bg-card p-5">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2e2e45" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: "#9ca3af", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#9ca3af", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e1e2e",
              border: "1px solid #2e2e45",
              borderRadius: "8px",
              color: "#fff",
            }}
            formatter={(value: number) => [`${value.toFixed(1)} ${unit}`, ""]}
            labelStyle={{ color: "#9ca3af" }}
          />
          <Bar
            dataKey="value"
            fill={color}
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
