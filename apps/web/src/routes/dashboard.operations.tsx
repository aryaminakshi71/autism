"use client";

import { CenterOperationsCommand } from "@/components/operations/CenterOperationsCommand";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/operations")({
  component: DashboardOperationsPage,
});

function DashboardOperationsPage() {
  return <CenterOperationsCommand />;
}
