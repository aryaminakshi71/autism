"use client";

import { BrandingPanel } from "@/components/branding/BrandingPanel";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/branding")({
  component: BrandingPanel,
});
