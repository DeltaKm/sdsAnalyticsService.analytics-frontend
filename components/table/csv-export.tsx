"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TableRow } from "@/lib/types";

type CsvExportProps = {
  data: TableRow[];
  filename?: string;
  disabled?: boolean;
};

export function CsvExport({ data, filename = "export.csv", disabled = false }: CsvExportProps) {
  const handleExport = () => {
    if (disabled) return;
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(";"),
      ...data.map((row) =>
        headers.map((h) => {
          const val = row[h];
          if (val === null || val === undefined) return "";
          return String(val).replace(/"/g, '""');
        }).join(";")
      ),
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const isDisabled = disabled || data.length === 0;

  const button = (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={isDisabled}
      className={isDisabled ? "opacity-60" : undefined}
    >
      <Download className="h-4 w-4 mr-2" />
      CSV
    </Button>
  );

  if (isDisabled) {
    return <div className="cursor-not-allowed inline-flex">{button}</div>;
  }

  return button;
}
