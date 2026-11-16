"use client";

import { SessionNoteWorkspace } from "@/components/notes/SessionNoteWorkspace";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/sessions")({
  component: DashboardSessionsPage,
});

function DashboardSessionsPage() {
  return <SessionNoteWorkspace />;
}
