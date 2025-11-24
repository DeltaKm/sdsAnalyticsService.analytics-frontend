"use client";

export const dynamic = "force-dynamic";

import { Suspense, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SectionHeader } from "@/components/layout/section-header";
import { FiltersPanel } from "@/components/filters/filters-panel";
import { ChartWrapper } from "@/components/charts/chart-wrapper";
import { BarGeneric } from "@/components/charts/bar-generic";
import { DataTable } from "@/components/table/data-table";
import { CsvExport } from "@/components/table/csv-export";
import { PrintButton } from "@/components/table/print-button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiGet } from "@/lib/fetcher";
import { normalizeFilters } from "@/lib/url";
import type { AnalyticsResponse } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { formatCurrency, formatNumber } from "@/lib/format";
import { useDashboardFilters } from "@/hooks/use-dashboard-filters";

const tabs = [
  { value: "categories", label: "Categorie", endpoint: "/analytics/catalog/categories-top" },
  { value: "products", label: "Prodotti", endpoint: "/analytics/catalog/products-top" },
  { value: "by-type", label: "Tipologia", endpoint: "/analytics/catalog/by-type" },
];

export default function CatalogPage() {
  return (
    <Suspense fallback={<CatalogFallback />}> 
      <CatalogContent />
    </Suspense>
  );
}

function CatalogFallback() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

function CatalogContent() {
  const [activeTab, setActiveTab] = useState("categories");
  const { filters, applyFilters, clearFilters } = useDashboardFilters("/catalog");

  const currentEndpoint = tabs.find((t) => t.value === activeTab)?.endpoint || tabs[0].endpoint;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["catalog", activeTab, normalizeFilters(filters)],
    queryFn: () => apiGet<AnalyticsResponse>(currentEndpoint, normalizeFilters(filters)),
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

  const columns: ColumnDef<any>[] =
    data?.table.columns.map((col) => ({
      accessorKey: col.key,
      header: col.label,
      cell: ({ row }) => {
        const value = row.getValue(col.key);
        if (typeof value === "number") {
          return col.key.toLowerCase().includes("quantita") || col.key.toLowerCase().includes("numero")
            ? formatNumber(value)
            : formatCurrency(value);
        }
        return value;
      },
    })) || [];

  return (
    <div>
      <SectionHeader title="Catalogo">
        <CsvExport data={data?.table.rows || []} filename={`catalog-${activeTab}.csv`} />
        <PrintButton />
      </SectionHeader>

      <div className="grid lg:grid-cols-[300px_1fr] gap-6">
        <div>
          <FiltersPanel onApply={handleApply} onClear={handleClear} />
        </div>

        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              {tabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {tabs.map((tab) => (
              <TabsContent key={tab.value} value={tab.value} className="space-y-6">
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

                {data && (
                  <>
                    {data.chart.series.length > 0 && (
                      <ChartWrapper title={`Top 10 ${tab.label}`}>
                        <BarGeneric series={data.chart.series} />
                      </ChartWrapper>
                    )}

                    {data.table.rows.length > 0 && (
                      <DataTable columns={columns} data={data.table.rows} />
                    )}
                  </>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
