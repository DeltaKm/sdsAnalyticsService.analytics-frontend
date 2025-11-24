import type { Filters } from "./types";

export function filtersToSearchParams(filters: Filters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);
  filters.stores.forEach((s) => params.append("stores", s));
  filters.users?.forEach((u) => params.append("users", u));
  filters.categories?.forEach((c) => params.append("categories", c));
  filters.products?.forEach((p) => params.append("products", p));
  filters.devices?.forEach((d) => params.append("devices", d));
  if (filters.useBusinessHours) params.set("useBusinessHours", "true");
  return params;
}

export function searchParamsToFilters(sp: URLSearchParams): Partial<Filters> {
  return {
    from: sp.get("from") || "",
    to: sp.get("to") || "",
    stores: sp.getAll("stores"),
    users: sp.getAll("users"),
    categories: sp.getAll("categories"),
    products: sp.getAll("products"),
    devices: sp.getAll("devices"),
    useBusinessHours: sp.get("useBusinessHours") === "true",
  };
}

export function normalizeFilters(f: Filters): Record<string, any> {
  const obj: Record<string, any> = {};
  if (f.from) obj.from = f.from;
  if (f.to) obj.to = f.to;
  if (f.stores.length) obj.stores = f.stores;
  if (f.users?.length) obj.users = f.users;
  if (f.categories?.length) obj.categories = f.categories;
  if (f.products?.length) obj.products = f.products;
  if (f.devices?.length) obj.devices = f.devices;
  if (f.useBusinessHours) obj.useBusinessHours = true;
  return obj;
}
