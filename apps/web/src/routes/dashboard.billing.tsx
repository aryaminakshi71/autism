"use client";

import { BillingPanel } from "@/components/billing/BillingPanel";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/billing")({
  component: BillingPanel,
});
