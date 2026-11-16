// @shared/saas-core - Optimized Entry Point
// Only exports components currently in use by the application

// UI Components - Currently used
export { useDarkMode } from "./components/ui";
export { CommandPalette } from "./components/ui";

// Landing Components - Currently used
export { NewsletterSignup } from "./components/landing";

// Note: The following exports are available but currently unused:
// - All hooks (useCommon, useOffline, use-auth, use-compliance, use-tenant, use-continuation, use-optimistic, use-api, use-websocket, use-intersection, use-resize)
// - All utils (index, validation, helpers, rate-limit, metadata, websocket)
// - Types
// - Analytics
// - i18n
//
// If needed in the future, import directly from the submodule:
// import { something } from "@shared/saas-core/hooks/useCommon"
