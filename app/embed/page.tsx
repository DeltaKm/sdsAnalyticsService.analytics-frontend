"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EmbedPage() {
  const router = useRouter();

  useEffect(() => {
    void router.replace("/dashboard");
  }, [router]);

  return null;
}
