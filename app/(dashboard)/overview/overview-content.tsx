"use client";

import { useEffect, useMemo, Suspense, useState } from "react";
import { SectionHeader } from "@/components/layout/section-header";
import { Button } from "@/components/ui/button";
import { KpiCard } from "@/components/ui/kpi-card";
import { ChartWrapper } from "@/components/charts/chart-wrapper";
import { BarGeneric } from "@/components/charts/bar-generic";
import { LineGeneric } from "@/components/charts/line-generic";
import { DataTable } from "@/components/table/data-table";
import { CsvExport } from "@/components/table/csv-export";
import { PrintButton } from "@/components/table/print-button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { AnalyticsResponse } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { formatCurrency, formatNumber } from "@/lib/format";
import { trpc } from "@/lib/trpc/client";
import { TRPCClientError } from "@trpc/client";
import { Loader2 } from "lucide-react";
import { useDashboardFilters } from "@/hooks/use-dashboard-filters";

type OverviewContentProps = {
  demoMode: boolean;
  demoFrom: string;
  demoTo: string;
};

export function OverviewContent({ demoMode, demoFrom, demoTo }: OverviewContentProps) {
  const { filters, applyFilters, clearFilters, setFilters } = useDashboardFilters("/overview");
  const [selectedPreset, setSelectedPreset] = useState<30 | 90 | 365 | null>(30);

  useEffect(() => {
    if (filters.from && filters.to) return;

    if (demoMode && demoFrom && demoTo) {
      setFilters({
        from: demoFrom,
        to: demoTo,
        stores: [],
      });
      return;
    }

    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    setFilters({
      from: start.toISOString(),
      to: end.toISOString(),
      stores: [],
    });
  }, [filters.from, filters.to, setFilters, demoMode, demoFrom, demoTo]);

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

  const {
    data,
    isLoading,
    error,
    refetch,
  } = trpc.analytics.overview.useQuery(queryInput ?? {}, {
    enabled: Boolean(queryInput),
  });

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
    console.log(`[Overview] Setting preset: ${days} days`, { from: start.toISOString(), to: end.toISOString() });
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
      <SectionHeader title="Panoramica">
        <div className="flex items-center gap-2">
          <Button
            variant={selectedPreset === 30 ? "default" : "outline"}
            size="sm"
            onClick={() => setPresetDays(30)}
            disabled={demoMode}
            className="h-8 px-3 text-xs font-medium"
          >
            Ultimi 30 giorni
          </Button>
          <Button
            variant={selectedPreset === 90 ? "default" : "outline"}
            size="sm"
            onClick={() => setPresetDays(90)}
            disabled={demoMode}
            className="h-8 px-3 text-xs font-medium"
          >
            Ultimi 90 giorni
          </Button>
          <Button
            variant={selectedPreset === 365 ? "default" : "outline"}
            size="sm"
            onClick={() => setPresetDays(365)}
            disabled={demoMode}
            className="h-8 px-3 text-xs font-medium"
          >
            Ultimo anno
          </Button>
        </div>
        <CsvExport data={data?.table.rows || []} filename="overview.csv" disabled />
        <PrintButton disabled />
      </SectionHeader>

      <div className="space-y-6">
          {errorMessage && (
            <Alert variant="destructive">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {isLoading && <OverviewLoading />}

          {data && (
            <>
              <div className="grid md:grid-cols-3 gap-4">
                <KpiCard label="Venduto" value={data.kpi.venduto || 0} />
                <KpiCard label="Numero Vendite" value={data.kpi.numero_vendite || 0} format="number" />
                <KpiCard label="Media Vendita" value={data.kpi.media_vendita || 0} />
                <KpiCard label="Venduto con Coperto" value={data.kpi.venduto_coperto || 0} />
                <KpiCard label="Numero Coperti" value={data.kpi.numero_coperti || 0} format="number" />
                <KpiCard label="Media Coperto" value={data.kpi.media_coperto || 0} />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <ChartWrapper title="Incasso per Tipo Documento">
                  <BarGeneric series={data.chart.series} stacked />
                </ChartWrapper>
                <ChartWrapper title="Incasso per Orario">
                  <LineGeneric series={data.chart.series} />
                </ChartWrapper>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Dettaglio Vendite</h3>
                <DataTable columns={columns} data={data.table.rows} />
              </div>
            </>
          )}
      </div>
    </div>
  );
}

function OverviewLoading() {
  const barSkeletonHeights = [40, 55, 65, 48, 70, 52, 60, 45];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Caricamento dati in corso…</span>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-border/60 bg-muted p-4 shadow-sm"
          >
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="mt-4 h-8 w-1/2" />
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-border/60 bg-muted p-4 shadow-sm space-y-4"
          >
            <Skeleton className="h-5 w-1/4" />
            <div className="flex h-56 items-end gap-2">
              {barSkeletonHeights.map((height, barIndex) => (
                <Skeleton
                  key={barIndex}
                  className="w-full flex-1 rounded-sm"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-2 w-20" />
              <Skeleton className="h-2 w-12" />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border/60 bg-muted p-4 shadow-sm space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-5 w-1/5" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-24" />
        </div>
        <div className="divide-y divide-border/60 rounded-lg border border-border/60">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 px-4 py-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
