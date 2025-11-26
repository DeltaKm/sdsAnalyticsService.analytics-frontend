"use client";

import { createContext, useContext } from "react";
import type { EmbedSession } from "./session";

const EmbedSessionContext = createContext<EmbedSession | null>(null);

export function EmbedSessionProvider({
  session,
  children,
}: {
  session: EmbedSession;
  children: React.ReactNode;
}) {
  return (
    <EmbedSessionContext.Provider value={session}>
      {children}
    </EmbedSessionContext.Provider>
  );
}

export function useEmbedSession(): EmbedSession {
  const context = useContext(EmbedSessionContext);
  if (!context) {
    throw new Error("useEmbedSession must be used within an EmbedSessionProvider");
  }
  return context;
}
