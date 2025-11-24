"use client";

export const dynamic = "force-dynamic";

import { Suspense, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SectionHeader } from "@/components/layout/section-header";
import { FiltersPanel } from "@/components/filters/filters-panel";
import { DataTable } from "@/components/table/data-table";
import { CsvExport } from "@/components/table/csv-export";
import { PrintButton } from "@/components/table/print-button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Check } from "lucide-react";
import { apiGet } from "@/lib/fetcher";
import { normalizeFilters } from "@/lib/url";
import type { AnalyticsResponse } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { formatCurrency, formatNumber } from "@/lib/format";
import { useDashboardFilters } from "@/hooks/use-dashboard-filters";

type Section = "daily-detail" | "logs" | "categories" | "products";

export default function AdvancedReportPage() {
  return (
    <Suspense fallback={<AdvancedReportFallback />}> 
      <AdvancedReportContent />
    </Suspense>
  );
}

function AdvancedReportFallback() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

function AdvancedReportContent() {
  const [activeSection, setActiveSection] = useState<Section>("daily-detail");
  const [copied, setCopied] = useState(false);
  const { filters, applyFilters, clearFilters } = useDashboardFilters("/advanced-report");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["advanced-report", activeSection, normalizeFilters(filters)],
    queryFn: () => apiGet<AnalyticsResponse>("/analytics/advanced/report-link", {
      ...normalizeFilters(filters),
      section: activeSection,
    }),
    enabled: filters.from !== "" && filters.to !== "",
  });

  const handleApply = () => {
    applyFilters();
    refetch();
  };

  const handleClear = () => {
    clearFilters();
    refetch();
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const columns: ColumnDef<any>[] =
    data?.table.columns.map((col) => ({
      accessorKey: col.key,
      header: col.label,
      cell: ({ row }) => {
        const value = row.getValue(col.key);
        if (typeof value === "number") {
          return col.key.toLowerCase().includes("vendite") || col.key.toLowerCase().includes("numero") || col.key.toLowerCase().includes("quantita")
            ? formatNumber(value)
            : formatCurrency(value);
        }
        return value;
      },
    })) || [];

  return (
    <div>
      <SectionHeader title="Report Avanzato">
        <Button variant="outline" size="sm" onClick={handleCopyLink}>
          {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
          {copied ? "Copiato!" : "Copia Link"}
        </Button>
        <CsvExport data={data?.table.rows || []} filename={`advanced-${activeSection}.csv`} />
        <PrintButton />
      </SectionHeader>

      <div className="grid lg:grid-cols-[300px_1fr] gap-6">
        <div className="space-y-6">
          <FiltersPanel onApply={handleApply} onClear={handleClear} />

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Sezioni</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id="daily-detail"
                  checked={activeSection === "daily-detail"}
                  onCheckedChange={(checked) => checked && setActiveSection("daily-detail")}
                />
                <Label htmlFor="daily-detail">Dettaglio Giorni</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="logs"
                  checked={activeSection === "logs"}
                  onCheckedChange={(checked) => checked && setActiveSection("logs")}
                />
                <Label htmlFor="logs">Logs</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="categories"
                  checked={activeSection === "categories"}
                  onCheckedChange={(checked) => checked && setActiveSection("categories")}
                />
                <Label htmlFor="categories">Categorie</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="products"
                  checked={activeSection === "products"}
                  onCheckedChange={(checked) => checked && setActiveSection("products")}
                />
                <Label htmlFor="products">Prodotti</Label>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{(error as Error).message}</AlertDescription>
            </Alert>
          )}

          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-64 w-full" />
            </div>
          )}

          {data && data.table.rows.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 capitalize">
                {activeSection.replace("-", " ")}
              </h3>
              <DataTable columns={columns} data={data.table.rows} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
