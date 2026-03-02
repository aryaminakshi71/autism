import { StartClient } from "@tanstack/react-start/client";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { initAnalytics } from "./lib/analytics";
import { initPlatformObservability } from "./lib/platform-observability";
import { initSentry } from "./lib/sentry";
import { registerServiceWorker } from "./lib/service-worker";

initPlatformObservability({ appId: "autism" });

initSentry();
initAnalytics();
registerServiceWorker();

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <StartClient />
    </StrictMode>,
  );
});
