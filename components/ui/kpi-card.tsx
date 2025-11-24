import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatNumber } from "@/lib/format";

type KpiCardProps = {
  label: string;
  value: number;
  format?: "currency" | "number";
};

export function KpiCard({ label, value, format = "currency" }: KpiCardProps) {
  const formatted = format === "currency" ? formatCurrency(value) : formatNumber(value);
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatted}</div>
      </CardContent>
    </Card>
  );
}
