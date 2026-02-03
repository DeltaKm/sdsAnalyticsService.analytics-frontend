"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Menu,
  LayoutDashboard,
  ShoppingCart,
  Package,
  Radio,
  Users,
  Monitor,
  Clock,
  UserCheck,
  FileText
} from "lucide-react";

const navItems = [
  { href: "/overview", label: "Panoramica", icon: LayoutDashboard },
  { href: "/sales", label: "Vendite", icon: ShoppingCart },
  { href: "/catalog", label: "Catalogo", icon: Package },
  { href: "/channels", label: "Canali", icon: Radio },
  { href: "/operators", label: "Operatori", icon: Users },
  { href: "/devices", label: "Dispositivi", icon: Monitor },
  { href: "/time-slots", label: "Fasce Orarie", icon: Clock },
  { href: "/customers", label: "Clienti", icon: UserCheck },
  { href: "/advanced-report", label: "Report Avanzato", icon: FileText },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isEmbedRoute = pathname?.startsWith("/dashboard");
  const withBase = (href: string) => (isEmbedRoute ? `/dashboard${href}` : href);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="pr-0 bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] border-r border-border shadow-lg"
      >
        <SheetTitle className="sr-only">Menu di Navigazione</SheetTitle>
        <SheetDescription className="sr-only">
          Menu principale per la navigazione tra le diverse sezioni della dashboard analytics.
        </SheetDescription>
        <div className="px-7">
          <Link
            href={withBase("/overview")}
            className="flex items-center gap-3 font-bold text-lg"
            onClick={() => setOpen(false)}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <span>Analytics</span>
          </Link>
        </div>
        <div className="flex flex-col gap-4 py-4 mt-4">
          <nav className="grid gap-1 px-2">
            {navItems.map((item) => {
              const targetHref = withBase(item.href);
              const isActive = pathname === targetHref;
              const isOverview = item.href === "/overview";
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={targetHref}
                  prefetch={isOverview}
                  className={cn(
                    "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    !isOverview && "cursor-not-allowed opacity-80",
                    isActive
                      ? "bg-slate-100 text-slate-900 dark:bg-[#8bc63e] dark:text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-[hsl(var(--foreground))] dark:hover:bg-[#79ab38] dark:hover:text-white",
                    !isOverview && !isActive && "hover:bg-transparent hover:text-slate-600 dark:hover:bg-transparent dark:hover:text-slate-400"
                  )}
                  onClick={(e) => {
                    if (!isOverview) {
                      e.preventDefault();
                      e.stopPropagation();
                      return;
                    }
                    setOpen(false);
                  }}
                  role={isOverview ? "link" : "presentation"}
                  aria-disabled={!isOverview}
                  tabIndex={isOverview ? 0 : -1}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
            <div className="border-t mt-2 pt-2 px-3">
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
