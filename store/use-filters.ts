import { create } from "zustand";
import type { Filters } from "@/lib/types";

type State = Filters & {
  set: (p: Partial<Filters>) => void;
  reset: () => void;
};

const initialState: Filters = {
  from: "",
  to: "",
  stores: [],
  users: [],
  categories: [],
  products: [],
  devices: [],
  useBusinessHours: false,
};

export const useFiltersStore = create<State>((set) => ({
  ...initialState,
  set: (p) => set((state) => ({ ...state, ...p })),
  reset: () => set(initialState),
}));
