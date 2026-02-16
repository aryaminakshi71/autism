import { createFileRoute } from "@tanstack/react-router";
import { api } from "~/server/api/app";

export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: async ({ request }) => api.fetch(request),
    },
  },
});
