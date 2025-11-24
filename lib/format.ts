export function formatCurrency(n: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(n);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("it-IT").format(n);
}

export function formatPercent(n: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(n / 100);
}

export function formatDateTime(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("it-IT", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Europe/Rome",
  }).format(date);
}

export function formatDate(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("it-IT", {
    dateStyle: "short",
    timeZone: "Europe/Rome",
  }).format(date);
}
