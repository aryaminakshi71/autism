"use client";

import { useEffect } from "react";

function orgHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  if (localStorage.getItem("demo_mode") === "true") {
    return { "x-demo-mode": "true", "x-organization-id": "demo-org" };
  }
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.companyId) return { "x-organization-id": user.companyId };
  } catch {}
  return {};
}

export function WhiteLabelProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/rpc/branding/get", {
          credentials: "include",
          headers: orgHeaders(),
        });
        if (!res.ok) return;
        const data: any = await res.json();
        const b = data?.json ?? data;
        if (cancelled || !b) return;
        if (b.brandName) document.title = `${b.brandName} - Care Coordination & Outcomes`;
        if (b.primaryColor) {
          document.documentElement.style.setProperty("--brand-primary", b.primaryColor);
        }
      } catch {
        // branding is optional
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return <>{children}</>;
}
