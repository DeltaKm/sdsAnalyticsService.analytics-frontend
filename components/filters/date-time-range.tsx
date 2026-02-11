"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
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

  useEffect(() => {
    if (from && to) {
      setDate({ from: new Date(from), to: new Date(to) });
    } else {
      setDate(undefined);
    }

    if (from) {
      const d = new Date(from);
      setFromTime(`${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`);
    } else {
      setFromTime("00:00");
    }

    if (to) {
      const d = new Date(to);
      setToTime(`${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`);
    } else {
      setToTime("23:59");
    }
  }, [from, to]);

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
    <div className="space-y-3">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium leading-none">
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "dd MMM yyyy")} - {format(date.to, "dd MMM yyyy")}
                    </>
                  ) : (
                    format(date.from, "dd MMM yyyy")
                  )
                ) : (
                  <span className="text-muted-foreground">Seleziona periodo</span>
                )}
              </p>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex justify-center">
            <Calendar
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
              className="rounded-md"
            />
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Ora Inizio</Label>
                <Input
                  type="time"
                  value={fromTime}
                  onChange={(e) => setFromTime(e.target.value)}
                  className="h-9"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Ora Fine</Label>
                <Input
                  type="time"
                  value={toTime}
                  onChange={(e) => setToTime(e.target.value)}
                  className="h-9"
                />
              </div>
            </div>
            
            <Button 
              onClick={handleApply} 
              className="w-full h-10 font-medium"
              size="default"
            >
              Applica Selezione
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
