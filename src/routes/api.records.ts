import { createFileRoute } from "@tanstack/react-router";
import { create, list, options } from "@/lib/json-http.server";

export const Route = createFileRoute("/api/records")({
  server: {
    handlers: {
      GET: ({ request }) => list(request),
      POST: ({ request }) => create(request),
      OPTIONS: () => options(),
    },
  },
});
