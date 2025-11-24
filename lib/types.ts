export type Filters = {
  from: string;
  to: string;
  stores: string[];
  users?: string[];
  categories?: string[];
  products?: string[];
  devices?: string[];
  useBusinessHours: boolean;
};

export type Kpi = Record<string, number>;

export type SeriesPoint = { x: string | number; y: number };

export type Series = { name: string; data: SeriesPoint[] };

export type TableColumn = {
  key: string;
  label: string;
  align?: "left" | "right";
  width?: number;
};

export type TableRow = Record<string, string | number | null>;

export type AnalyticsResponse = {
  kpi: Kpi;
  chart: { series: Series[]; xLabel?: string; yLabel?: string };
  table: { columns: TableColumn[]; rows: TableRow[] };
};
