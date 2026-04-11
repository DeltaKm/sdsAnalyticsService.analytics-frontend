"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Radio,
  Users,
  Monitor,
  Clock,
  UserCheck,
  FileText,
  ChevronRight,
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

const enabledRoutes = new Set(["/overview", "/sales", "/catalog"]);

export function AppSidebar() {
  const pathname = usePathname();
  const isEmbedRoute = pathname?.startsWith("/dashboard");
  const withBase = (href: string) => (isEmbedRoute ? `/dashboard${href}` : href);

  return (
    <div className="hidden border-r bg-card md:block md:sticky md:top-0 md:h-screen">
      <div className="flex h-full flex-col overflow-y-auto">
        <div className="flex h-16 items-center border-b px-6">
          <Link href={withBase("/overview")} className="flex items-center gap-3 font-bold text-lg">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <span>Analytics</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <nav className="grid gap-1 px-3">
            {navItems.map((item) => {
              const targetHref = withBase(item.href);
              const isActive = pathname === targetHref;
              const isEnabled = enabledRoutes.has(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={targetHref}
                  prefetch={isEnabled}
                  className={cn(
                    "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    !isEnabled && "cursor-not-allowed opacity-80",
                    isActive
                      ? "bg-slate-100 text-slate-900 dark:bg-[#8bc63e] dark:text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-[hsl(var(--foreground))] dark:hover:bg-[#79ab38] dark:hover:text-white",
                    !isEnabled && !isActive && "hover:bg-transparent hover:text-slate-600 dark:hover:bg-transparent dark:hover:text-slate-400"
                  )}
                  aria-disabled={!isEnabled}
                  role={isEnabled ? "link" : "presentation"}
                  tabIndex={isEnabled ? 0 : -1}
                  onClick={(event) => {
                    if (!isEnabled) {
                      event.preventDefault();
                      event.stopPropagation();
                    }
                  }}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
            <div className="border-t mt-2 pt-2">
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
