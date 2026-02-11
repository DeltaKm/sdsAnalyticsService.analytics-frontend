"use client";

import { useState } from "react";
import { Filter, ChevronDown, Calendar, Store, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DateTimeRange } from "./date-time-range";
import { MultiSelect } from "./multi-select";
import { useFiltersStore } from "@/store/use-filters";
import { startOfDay, endOfDay, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";

type FiltersOptionsProps = {
  storeOptions?: { value: string; label: string }[];
  userOptions?: { value: string; label: string }[];
  categoryOptions?: { value: string; label: string }[];
  productOptions?: { value: string; label: string }[];
  deviceOptions?: { value: string; label: string }[];
  onApply: () => void;
  onClear: () => void;
  disabled?: boolean;
};

function FiltersContent({
  storeOptions = [],
  userOptions = [],
  categoryOptions = [],
  productOptions = [],
  deviceOptions = [],
  onApply,
  onClear,
}: FiltersOptionsProps) {
  const filters = useFiltersStore();
  const [openSections, setOpenSections] = useState({
    date: false,
    stores: false,
    advanced: false,
  });

  const shortcuts = [
    {
      label: "Oggi",
      action: () => {
        const start = startOfDay(new Date());
        const end = endOfDay(new Date());
        filters.set({ from: start.toISOString(), to: end.toISOString() });
      },
    },
    {
      label: "Ieri",
      action: () => {
        const yesterday = subDays(new Date(), 1);
        const start = startOfDay(yesterday);
        const end = endOfDay(yesterday);
        filters.set({ from: start.toISOString(), to: end.toISOString() });
      },
    },
    {
      label: "Settimana",
      action: () => {
        const start = startOfWeek(new Date(), { weekStartsOn: 1 });
        const end = endOfWeek(new Date(), { weekStartsOn: 1 });
        filters.set({ from: start.toISOString(), to: end.toISOString() });
      },
    },
    {
      label: "Settimana Scorsa",
      action: () => {
        const lastWeek = subDays(new Date(), 7);
        const start = startOfWeek(lastWeek, { weekStartsOn: 1 });
        const end = endOfWeek(lastWeek, { weekStartsOn: 1 });
        filters.set({ from: start.toISOString(), to: end.toISOString() });
      },
    },
    {
      label: "Mese",
      action: () => {
        const start = startOfMonth(new Date());
        const end = endOfMonth(new Date());
        filters.set({ from: start.toISOString(), to: end.toISOString() });
      },
    },
    {
      label: "Mese Scorso",
      action: () => {
        const lastMonth = subDays(startOfMonth(new Date()), 1);
        const start = startOfMonth(lastMonth);
        const end = endOfMonth(lastMonth);
        filters.set({ from: start.toISOString(), to: end.toISOString() });
      },
    },
    {
      label: "Anno",
      action: () => {
        const start = startOfYear(new Date());
        const end = endOfYear(new Date());
        filters.set({ from: start.toISOString(), to: end.toISOString() });
      },
    },
  ];

  return (
    <div className="space-y-3">
      <Collapsible
        open={openSections.date}
        onOpenChange={(open) => setOpenSections({ ...openSections, date: open })}
      >
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2 hover:bg-accent/50 rounded-md px-2 transition-colors">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Periodo</span>
          </div>
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${openSections.date ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-3">
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">Scorciatoie</Label>
            <div className="flex flex-wrap gap-2">
              {shortcuts.map((shortcut) => (
                <Button
                  key={shortcut.label}
                  variant="secondary"
                  size="sm"
                  className="h-8 px-3 text-xs font-medium rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={shortcut.action}
                >
                  {shortcut.label}
                </Button>
              ))}
            </div>
          </div>
          <DateTimeRange
            from={filters.from}
            to={filters.to}
            onChange={(from, to) => filters.set({ from, to })}
          />
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      {storeOptions.length > 0 && (
        <>
          <Collapsible
            open={openSections.stores}
            onOpenChange={(open) => setOpenSections({ ...openSections, stores: open })}
          >
            <CollapsibleTrigger className="flex w-full items-center justify-between py-2 hover:bg-accent/50 rounded-md px-2 transition-colors">
              <div className="flex items-center gap-2">
                <Store className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Punti Vendita</span>
              </div>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${openSections.stores ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">
              <MultiSelect
                label=""
                options={storeOptions}
                selected={filters.stores}
                onChange={(stores) => filters.set({ stores })}
              />
            </CollapsibleContent>
          </Collapsible>
          <Separator />
        </>
      )}

      {(userOptions.length > 0 || categoryOptions.length > 0 || productOptions.length > 0 || deviceOptions.length > 0) && (
        <>
          <Collapsible
            open={openSections.advanced}
            onOpenChange={(open) => setOpenSections({ ...openSections, advanced: open })}
          >
            <CollapsibleTrigger className="flex w-full items-center justify-between py-2 hover:bg-accent/50 rounded-md px-2 transition-colors">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filtri Avanzati</span>
              </div>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${openSections.advanced ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pt-2">
              {userOptions.length > 0 && (
                <MultiSelect
                  label="Utenti"
                  options={userOptions}
                  selected={filters.users || []}
                  onChange={(users) => filters.set({ users })}
                />
              )}

              {categoryOptions.length > 0 && (
                <MultiSelect
                  label="Categorie"
                  options={categoryOptions}
                  selected={filters.categories || []}
                  onChange={(categories) => filters.set({ categories })}
                />
              )}

              {productOptions.length > 0 && (
                <MultiSelect
                  label="Prodotti"
                  options={productOptions}
                  selected={filters.products || []}
                  onChange={(products) => filters.set({ products })}
                />
              )}

              {deviceOptions.length > 0 && (
                <MultiSelect
                  label="Dispositivi"
                  options={deviceOptions}
                  selected={filters.devices || []}
                  onChange={(devices) => filters.set({ devices })}
                />
              )}

              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="business-hours"
                  checked={filters.useBusinessHours}
                  onCheckedChange={(checked) => filters.set({ useBusinessHours: checked })}
                />
                <Label htmlFor="business-hours" className="text-sm">Usa orario di esercizio</Label>
              </div>
            </CollapsibleContent>
          </Collapsible>
          <Separator />
        </>
      )}

      <div className="flex gap-2 pt-2">
        <Button onClick={onApply} className="flex-1" size="sm">
          Applica
        </Button>
        <Button onClick={onClear} variant="outline" className="flex-1" size="sm">
          Cancella
        </Button>
      </div>
    </div>
  );
}

export function FiltersPanel(props: FiltersOptionsProps) {
  const { disabled = false } = props;
  const [open, setOpen] = useState(false);

  if (disabled) {
    return (
      <div className="cursor-not-allowed">
        <Button
          variant="outline"
          size="icon"
          disabled
          className="opacity-60"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Filtri</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <FiltersContent
            {...props}
            onApply={() => {
              props.onApply();
              setOpen(false);
            }}
            onClear={() => {
              props.onClear();
              setOpen(false);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
