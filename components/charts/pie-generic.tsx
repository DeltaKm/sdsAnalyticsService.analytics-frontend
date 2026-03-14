"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { Series } from "@/lib/types";
import { formatCurrency } from "@/lib/format";

type PieGenericProps = {
  series: Series[];
};

type PieRow = {
  name: string;
  value: number;
};

const COLORS = [
  "#8bc63e",
  "#06b6d4",
  "#f59e0b",
  "#10b981",
  "#14b8a6",
  "#f97316",
  "#6366f1",
  "#ec4899",
];

export function PieGeneric({ series }: PieGenericProps) {
  const data: PieRow[] = series
    .map((item) => ({
      name: item.name,
      value: Number(item.data[0]?.y ?? 0),
    }))
    .filter((item) => item.value > 0);

  if (data.length === 0) {
    return <div className="flex h-[350px] items-center justify-center text-sm text-muted-foreground">Nessun dato disponibile</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
          {data.map((entry, idx) => (
            <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => formatCurrency(Number(value))}
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
