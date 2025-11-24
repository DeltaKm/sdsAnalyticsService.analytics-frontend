import { useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useFiltersStore } from "@/store/use-filters";
import { filtersToSearchParams, searchParamsToFilters } from "@/lib/url";
import type { Filters } from "@/lib/types";

export function useDashboardFilters(pathname: string) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filterValues = useFiltersStore((state) => {
    const { set, reset, ...rest } = state;
    return rest as Filters;
  });
  const setFilters = useFiltersStore((state) => state.set);
  const resetFilters = useFiltersStore((state) => state.reset);

  const paramsKey = useMemo(() => searchParams.toString(), [searchParams]);
  const prevParamsRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (prevParamsRef.current === paramsKey) return;
    prevParamsRef.current = paramsKey;
    const parsed = searchParamsToFilters(new URLSearchParams(paramsKey));
    setFilters(parsed);
  }, [paramsKey, setFilters]);

  const applyFilters = () => {
    const params = filtersToSearchParams(filterValues);
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    resetFilters();
    router.push(pathname);
  };

  return {
    filters: filterValues,
    applyFilters,
    clearFilters,
    setFilters,
  } as const;
}
