export const dynamic = "force-dynamic";

import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { EmbedSessionProvider } from "@/lib/embed/context";
import { EMBED_SESSION_COOKIE } from "@/lib/embed/session";

type Props = {
  children: ReactNode;
};

export default async function DashboardLayout({ children }: Props) {
  const cookieStore = await cookies();
  const token = cookieStore.get(EMBED_SESSION_COOKIE)?.value ?? null;

  if (!token) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-slate-100">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight">Unauthorized</h1>
          <p className="text-slate-300">
            Accesso alla dashboard non autorizzato. Richiedi un nuovo link di embed valido e riprova.
          </p>
        </div>
      </div>
    );
  }

  // Create minimal session - data-service will handle real validation
  const session = {
    uniqueKey: "unknown",
    userId: "embed-user",
    permissions: [],
    iat: 0,
    exp: 0,
  };

  return (
    <EmbedSessionProvider session={session}>
      <DashboardShell>{children}</DashboardShell>
    </EmbedSessionProvider>
  );
}
