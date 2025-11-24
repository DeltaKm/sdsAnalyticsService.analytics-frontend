"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { Series } from "@/lib/types";
import { formatCurrency } from "@/lib/format";

type BarGenericProps = {
  series: Series[];
  xLabel?: string;
  yLabel?: string;
  stacked?: boolean;
};

const COLORS = [
  "#8b5cf6",
  "#06b6d4",
  "#f59e0b",
  "#ec4899",
  "#10b981",
  "#6366f1",
  "#f97316",
  "#14b8a6"
];

export function BarGeneric({ series, xLabel, yLabel, stacked }: BarGenericProps) {
  const data = series[0]?.data.map((point, idx) => {
    const row: any = { x: point.x };
    series.forEach((s) => {
      row[s.name] = s.data[idx]?.y ?? 0;
    });
    return row;
  }) || [];

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} barCategoryGap="20%">
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis 
          dataKey="x" 
          label={{ value: xLabel, position: "insideBottom", offset: -5 }}
          className="text-xs"
        />
        <YAxis 
          label={{ value: yLabel, angle: -90, position: "insideLeft" }}
          className="text-xs"
        />
        <Tooltip 
          formatter={(value: any) => formatCurrency(Number(value))}
          contentStyle={{ 
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px'
          }}
          cursor={false}
        />
        <Legend />
        {series.map((s, idx) => (
          <Bar
            key={s.name}
            dataKey={s.name}
            fill={COLORS[idx % COLORS.length]}
            stackId={stacked ? "stack" : undefined}
            radius={[8, 8, 0, 0]}
            activeBar={{
              fill: COLORS[idx % COLORS.length],
              opacity: 1,
              stroke: COLORS[idx % COLORS.length],
              strokeWidth: 3,
              filter: 'brightness(1.2)'
            }}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
