"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
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

export function AppSidebar() {
  const pathname = usePathname();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="hidden border-r bg-card md:block">
      <div className="flex h-full max-h-screen flex-col">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/overview" className="flex items-center gap-3 font-bold text-lg">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <span>Analytics</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <nav className="grid gap-1 px-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const isOverview = item.href === "/overview";
              const Icon = item.icon;

              const baseStyle = isActive
                ? isDark
                  ? { color: "white", backgroundColor: "#7c3aed" }
                  : { color: "white", backgroundColor: "#0f172a" }
                : isDark
                  ? { color: "#94a3b8" }
                  : { color: "#475569" };

              const sharedProps = {
                className: "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                style: { ...baseStyle, cursor: isOverview ? "pointer" : "not-allowed" as const },
                onMouseEnter: (e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>) => {
                  if (!isOverview) return;
                  if (!isActive) {
                    if (isDark) {
                      e.currentTarget.style.color = "white";
                      e.currentTarget.style.backgroundColor = "#475569";
                    } else {
                      e.currentTarget.style.color = "#0f172a";
                      e.currentTarget.style.backgroundColor = "#f1f5f9";
                    }
                  } else {
                    if (isDark) {
                      e.currentTarget.style.backgroundColor = "#6d28d9";
                    } else {
                      e.currentTarget.style.backgroundColor = "#374151";
                    }
                  }
                },
                onMouseLeave: (e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>) => {
                  if (!isOverview) return;
                  if (!isActive) {
                    if (isDark) {
                      e.currentTarget.style.color = "#94a3b8";
                      e.currentTarget.style.backgroundColor = "transparent";
                    } else {
                      e.currentTarget.style.color = "#475569";
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  } else {
                    if (isDark) {
                      e.currentTarget.style.backgroundColor = "#7c3aed";
                    } else {
                      e.currentTarget.style.backgroundColor = "#0f172a";
                    }
                  }
                },
              };

              const content = (
                <>
                  <Icon className="h-5 w-5" />
                  {item.label}
                </>
              );

              if (isOverview) {
                return (
                  <Link key={item.href} href={item.href} {...sharedProps}>
                    {content}
                  </Link>
                );
              }

              return (
                <div key={item.href} {...sharedProps} aria-disabled="true" role="link" tabIndex={-1}>
                  {content}
                </div>
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
