"use client";

export const dynamic = "force-dynamic";

import { Suspense, useEffect, useMemo, useState } from "react";
import { SectionHeader } from "@/components/layout/section-header";
import { FiltersPanel } from "@/components/filters/filters-panel";
import { KpiCard } from "@/components/ui/kpi-card";
import { ChartWrapper } from "@/components/charts/chart-wrapper";
import { BarGeneric } from "@/components/charts/bar-generic";
import { PieGeneric } from "@/components/charts/pie-generic";
import { DataTable } from "@/components/table/data-table";
import { CsvExport } from "@/components/table/csv-export";
import { PrintButton } from "@/components/table/print-button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AnalyticsResponse } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { formatCurrency, formatNumber } from "@/lib/format";
import { useDashboardFilters } from "@/hooks/use-dashboard-filters";
import { trpc } from "@/lib/trpc/client";
import { TRPCClientError } from "@trpc/client";
import { Loader2 } from "lucide-react";

type TabValue = "categories" | "products" | "by-type";

const tabs: Array<{ value: TabValue; label: string }> = [
  { value: "categories", label: "Categorie" },
  { value: "products", label: "Prodotti" },
  { value: "by-type", label: "Tipologia" },
];

const TAB_TITLES: Record<TabValue, string> = {
  categories: "Incasso per categorie",
  products: "Incasso per prodotti",
  "by-type": "Incasso per tipologia",
};

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
  const [activeTab, setActiveTab] = useState<TabValue>("categories");
  const { filters, applyFilters, clearFilters, setFilters } = useDashboardFilters("/catalog");

  useEffect(() => {
    if (filters.from && filters.to) return;

    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);

    setFilters({
      from: start.toISOString(),
      to: end.toISOString(),
      stores: [],
    });
  }, [filters.from, filters.to, setFilters]);

  const queryInput = useMemo(() => {
    if (!filters.from || !filters.to) {
      return null;
    }

    return {
      from: filters.from,
      to: filters.to,
      stores: filters.stores.length ? filters.stores : undefined,
    };
  }, [filters.from, filters.to, filters.stores]);

  const categoriesQuery = trpc.analytics.catalogCategoriesTop.useQuery(queryInput ?? {}, {
    enabled: Boolean(queryInput) && activeTab === "categories",
  });

  const productsQuery = trpc.analytics.catalogProductsTop.useQuery(queryInput ?? {}, {
    enabled: Boolean(queryInput) && activeTab === "products",
  });

  const byTypeQuery = trpc.analytics.catalogByType.useQuery(queryInput ?? {}, {
    enabled: Boolean(queryInput) && activeTab === "by-type",
  });

  const activeQuery =
    activeTab === "categories" ? categoriesQuery : activeTab === "products" ? productsQuery : byTypeQuery;

  const { data, isLoading, error } = activeQuery;

  const errorMessage = useMemo(() => {
    if (!error) return null;
    if (error instanceof TRPCClientError) return error.message;
    if (error instanceof Error) return error.message;
    if (typeof error === "string") return error;
    return "Si è verificato un errore imprevisto.";
  }, [error]);

  const pieSeries = useMemo(() => {
    if (!data || activeTab !== "categories") return [];

    return data.table.rows
      .slice(0, 10)
      .map((row) => ({
        name: String(row.nome_categoria ?? "Altro"),
        data: [{ x: "Composizione", y: Number(row.venduto ?? 0) }],
      }));
  }, [data, activeTab]);

  const handleApply = () => {
    applyFilters();
    void activeQuery.refetch();
  };

  const handleClear = () => {
    clearFilters();
    void activeQuery.refetch();
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
    <div className="space-y-6">
      <SectionHeader title="Categorie e Prodotti">
        <FiltersPanel onApply={handleApply} onClear={handleClear} />
        <CsvExport data={data?.table.rows || []} filename={`catalog-${activeTab}.csv`} disabled={!data} />
        <PrintButton disabled={!data} />
      </SectionHeader>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabValue)}>
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="space-y-6">
            {errorMessage && (
              <Alert variant="destructive">
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            {isLoading && <CatalogLoading />}

            {data && (
              <>
                <div className="grid md:grid-cols-3 gap-4">
                  <KpiCard label="Venduto" value={data.kpi.venduto || 0} />
                  <KpiCard label="Quantità" value={data.kpi.quantita || 0} format="number" />
                  <KpiCard label="Media" value={data.kpi.media || 0} />
                </div>

                {activeTab === "categories" ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    <ChartWrapper title="Composizione categorie">
                      <PieGeneric series={pieSeries} />
                    </ChartWrapper>
                    <ChartWrapper title={TAB_TITLES[tab.value]}>
                      <BarGeneric series={data.chart.series} />
                    </ChartWrapper>
                  </div>
                ) : (
                  <ChartWrapper title={TAB_TITLES[tab.value]}>
                    <BarGeneric series={data.chart.series} />
                  </ChartWrapper>
                )}

                <DataTable columns={columns} data={data.table.rows} />
              </>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function CatalogLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Caricamento dati catalogo in corso…</span>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="rounded-xl border border-border/60 bg-muted p-4 shadow-sm">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="mt-4 h-8 w-1/2" />
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-72 w-full" />
      </div>

      <Skeleton className="h-72 w-full" />
    </div>
  );
}
