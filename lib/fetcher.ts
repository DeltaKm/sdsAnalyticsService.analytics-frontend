import { mockOverviewData, mockSalesData, mockCatalogData, mockChannelsData, mockOperatorsData } from "./mock-data";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;
const USE_MOCK = false;

export async function apiGet<T>(path: string, params: Record<string, any>): Promise<T> {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (path.includes("/overview")) return mockOverviewData as T;
    if (path.includes("/sales")) return mockSalesData as T;
    if (path.includes("/catalog")) return mockCatalogData as T;
    if (path.includes("/channels")) return mockChannelsData as T;
    if (path.includes("/operators")) return mockOperatorsData as T;
    if (path.includes("/devices")) return mockOperatorsData as T;
    if (path.includes("/time")) return mockOverviewData as T;
    if (path.includes("/customers")) return mockOperatorsData as T;
    if (path.includes("/advanced")) return mockSalesData as T;
    
    return mockOverviewData as T;
  }

  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (Array.isArray(v)) {
      v.forEach(x => qs.append(k, String(x)));
    } else if (v !== undefined && v !== null) {
      qs.set(k, String(v));
    }
  }
  const url = `${BASE}${path}?${qs.toString()}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${path} ${res.status} ${text}`);
  }
  return res.json() as Promise<T>;
}
