import { useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useFiltersStore } from "@/store/use-filters";
import { filtersToSearchParams, searchParamsToFilters } from "@/lib/url";
import type { Filters } from "@/lib/types";

type DashboardFiltersHook = {
  filters: Filters;
  applyFilters: () => void;
  clearFilters: () => void;
  setFilters: (partial: Partial<Filters>) => void;
};

export function useDashboardFilters(pathname: string) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const from = useFiltersStore((state) => state.from);
  const to = useFiltersStore((state) => state.to);
  const stores = useFiltersStore((state) => state.stores);
  const users = useFiltersStore((state) => state.users);
  const categories = useFiltersStore((state) => state.categories);
  const products = useFiltersStore((state) => state.products);
  const devices = useFiltersStore((state) => state.devices);
  const useBusinessHours = useFiltersStore((state) => state.useBusinessHours);
  const setFilters = useFiltersStore((state) => state.set);
  const resetFilters = useFiltersStore((state) => state.reset);

  const filters: Filters = useMemo(
    () => ({ from, to, stores, users, categories, products, devices, useBusinessHours }),
    [from, to, stores, users, categories, products, devices, useBusinessHours],
  );

  const paramsKey = useMemo(() => searchParams.toString(), [searchParams]);
  const prevParamsRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (prevParamsRef.current === paramsKey) return;
    prevParamsRef.current = paramsKey;
    const parsed = searchParamsToFilters(new URLSearchParams(paramsKey));
    setFilters(parsed);
  }, [paramsKey, setFilters]);

  const applyFilters = () => {
    const params = filtersToSearchParams(filters);
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    resetFilters();
    router.push(pathname);
  };

  return {
    filters,
    applyFilters,
    clearFilters,
    setFilters,
  } satisfies DashboardFiltersHook;
}
