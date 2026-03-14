"use client";

export const dynamic = "force-dynamic";

import { Suspense, useEffect, useMemo, useState } from "react";
import { SectionHeader } from "@/components/layout/section-header";
import { Button } from "@/components/ui/button";
import { KpiCard } from "@/components/ui/kpi-card";
import { ChartWrapper } from "@/components/charts/chart-wrapper";
import { BarGeneric } from "@/components/charts/bar-generic";
import { LineGeneric } from "@/components/charts/line-generic";
import { PieGeneric } from "@/components/charts/pie-generic";
import { DataTable } from "@/components/table/data-table";
import { CsvExport } from "@/components/table/csv-export";
import { PrintButton } from "@/components/table/print-button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { AnalyticsResponse } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { formatCurrency, formatNumber } from "@/lib/format";
import { useDashboardFilters } from "@/hooks/use-dashboard-filters";
import { trpc } from "@/lib/trpc/client";
import { TRPCClientError } from "@trpc/client";
import { Loader2 } from "lucide-react";

const KPI_LABELS: Record<string, string> = {
  venduto: "Venduto",
  numero_documenti: "Numero Documenti",
  ticket_medio: "Ticket Medio",
  venduto_scontrini: "Venduto Scontrini",
  venduto_fatture: "Venduto Fatture",
  incidenza_scontrini_pct: "Incidenza Scontrini %",
  incidenza_fatture_pct: "Incidenza Fatture %",
};

export default function SalesPage() {
  return (
    <Suspense fallback={<SalesFallback />}> 
      <SalesContent />
    </Suspense>
  );
}

function SalesFallback() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

function SalesContent() {
  const { filters, setFilters } = useDashboardFilters("/sales");
  const [selectedPreset, setSelectedPreset] = useState<30 | 90 | 365 | null>(30);

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

  const { data, isLoading, error } = trpc.analytics.venduto.useQuery(queryInput ?? {}, {
    enabled: Boolean(queryInput),
  });

  const vendutoCompositionSeries = useMemo(() => {
    if (!data) return [];

    return [
      {
        name: "Venduto Scontrini",
        data: [{ x: "Composizione", y: Number(data.kpi.venduto_scontrini ?? 0) }],
      },
      {
        name: "Venduto Fatture",
        data: [{ x: "Composizione", y: Number(data.kpi.venduto_fatture ?? 0) }],
      },
    ];
  }, [data]);

  const topStoresSeries = useMemo(() => {
    if (!data) return [];

    const topStores = data.table.rows
      .map((row) => ({
        store: typeof row.store === "string" ? row.store : String(row.store ?? "-"),
        venduto: typeof row.venduto === "number" ? row.venduto : Number(row.venduto ?? 0),
      }))
      .sort((a, b) => b.venduto - a.venduto)
      .slice(0, 5);

    return [
      {
        name: "Venduto",
        data: topStores.map((item) => ({ x: item.store, y: Number(item.venduto.toFixed(2)) })),
      },
    ];
  }, [data]);

  const errorMessage = useMemo(() => {
    if (!error) return null;
    if (error instanceof TRPCClientError) return error.message;
    if (error instanceof Error) return error.message;
    if (typeof error === "string") return error;
    return "Si è verificato un errore imprevisto.";
  }, [error]);

  const setPresetDays = (days: 30 | 90 | 365) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);

    setSelectedPreset(days);
    setFilters({
      from: start.toISOString(),
      to: end.toISOString(),
      stores: [],
    });
  };

  const columns: ColumnDef<any>[] =
    data?.table.columns.map((col) => ({
      accessorKey: col.key,
      header: col.label,
      cell: ({ row }) => {
        const value = row.getValue(col.key);
        if (typeof value === "number") {
          return col.key.toLowerCase().includes("vendite") || col.key.toLowerCase().includes("numero")
            ? formatNumber(value)
            : formatCurrency(value);
        }
        return value;
      },
    })) || [];

  return (
    <div className="space-y-6">
      <SectionHeader title="Vendite">
        <div className="flex items-center gap-2">
          <Button
            variant={selectedPreset === 30 ? "default" : "outline"}
            size="sm"
            onClick={() => setPresetDays(30)}
            className="h-8 px-3 text-xs font-medium"
          >
            Ultimi 30 giorni
          </Button>
          <Button
            variant={selectedPreset === 90 ? "default" : "outline"}
            size="sm"
            onClick={() => setPresetDays(90)}
            className="h-8 px-3 text-xs font-medium"
          >
            Ultimi 90 giorni
          </Button>
          <Button
            variant={selectedPreset === 365 ? "default" : "outline"}
            size="sm"
            onClick={() => setPresetDays(365)}
            className="h-8 px-3 text-xs font-medium"
          >
            Ultimo anno
          </Button>
        </div>
        <CsvExport data={data?.table.rows || []} filename="venduto.csv" disabled />
        <PrintButton disabled />
      </SectionHeader>

      <div className="space-y-6">
        {errorMessage && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {isLoading && <SalesLoading />}

        {data && (
          <>
            <div className="grid md:grid-cols-3 gap-4">
              {Object.entries(data.kpi).map(([key, value]) => {
                const lowerKey = key.toLowerCase();
                const format =
                  lowerKey.includes("numero") || lowerKey.includes("pct") ? "number" : "currency";

                return (
                  <KpiCard
                    key={key}
                    label={KPI_LABELS[key] ?? key.replace(/_/g, " ").toUpperCase()}
                    value={value}
                    format={format}
                  />
                );
              })}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <ChartWrapper title="Trend Venduto giornaliero">
                <LineGeneric series={data.chart.series.filter((item) => item.name === "Venduto")} />
              </ChartWrapper>
              <ChartWrapper title="Documenti giornalieri">
                <BarGeneric series={data.chart.series.filter((item) => item.name === "Documenti")} />
              </ChartWrapper>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <ChartWrapper title="Composizione venduto per documento">
                <PieGeneric series={vendutoCompositionSeries} />
              </ChartWrapper>
              <ChartWrapper title="Top 5 punti vendita per venduto">
                <BarGeneric series={topStoresSeries} />
              </ChartWrapper>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Dettaglio del venduto per punto vendita</h3>
              <DataTable columns={columns} data={data.table.rows} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SalesLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Caricamento dati venduto in corso…</span>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
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
