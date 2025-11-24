"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type DateTimeRangeProps = {
  from: string;
  to: string;
  onChange: (from: string, to: string) => void;
};

export function DateTimeRange({ from, to, onChange }: DateTimeRangeProps) {
  const [date, setDate] = useState<DateRange | undefined>(() => {
    if (from && to) {
      return {
        from: new Date(from),
        to: new Date(to),
      };
    }
    return undefined;
  });

  const [fromTime, setFromTime] = useState(() => {
    if (from) {
      const d = new Date(from);
      return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    }
    return "00:00";
  });

  const [toTime, setToTime] = useState(() => {
    if (to) {
      const d = new Date(to);
      return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    }
    return "23:59";
  });

  const handleApply = () => {
    if (date?.from && date?.to) {
      const [fh, fm] = fromTime.split(":").map(Number);
      const [th, tm] = toTime.split(":").map(Number);
      
      const fromDate = new Date(date.from);
      fromDate.setHours(fh, fm, 0, 0);
      
      const toDate = new Date(date.to);
      toDate.setHours(th, tm, 59, 999);
      
      onChange(fromDate.toISOString(), toDate.toISOString());
    }
  };

  return (
    <div className="space-y-2">
      <Label>Intervallo Data/Ora</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd/MM/yyyy")} - {format(date.to, "dd/MM/yyyy")}
                </>
              ) : (
                format(date.from, "dd/MM/yyyy")
              )
            ) : (
              <span>Seleziona periodo</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
          <div className="p-3 border-t space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Da Ora</Label>
                <Input
                  type="time"
                  value={fromTime}
                  onChange={(e) => setFromTime(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs">A Ora</Label>
                <Input
                  type="time"
                  value={toTime}
                  onChange={(e) => setToTime(e.target.value)}
                />
              </div>
            </div>
            <Button onClick={handleApply} className="w-full" size="sm">
              Applica
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
