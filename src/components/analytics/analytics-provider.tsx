import { useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { trackPageView } from "~/lib/analytics";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const location = useRouterState({ select: (state) => state.location });

  useEffect(() => {
    if (!location?.href) return;
    trackPageView(location.href);
  }, [location?.href]);

  return <>{children}</>;
}
