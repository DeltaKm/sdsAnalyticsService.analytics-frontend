"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

type PrintButtonProps = {
  disabled?: boolean;
};

export function PrintButton({ disabled = false }: PrintButtonProps) {
  const handlePrint = () => {
    if (disabled) return;
    window.print();
  };

  const button = (
    <Button
      variant="outline"
      size="sm"
      onClick={handlePrint}
      disabled={disabled}
      className={disabled ? "opacity-60" : undefined}
    >
      <Printer className="h-4 w-4 mr-2" />
      Stampa
    </Button>
  );

  if (disabled) {
    return <div className="cursor-not-allowed inline-flex">{button}</div>;
  }

  return button;
}
