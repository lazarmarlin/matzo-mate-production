import { createFileRoute } from "@tanstack/react-router";
import { list, options } from "@/lib/json-http.server";

export const Route = createFileRoute("/api/records.json")({
  server: {
    handlers: {
      GET: ({ request }) => list(request),
      OPTIONS: () => options(),
    },
  },
});
