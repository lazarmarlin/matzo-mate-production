import { createFileRoute } from "@tanstack/react-router";
import { catalog, options } from "@/lib/json-http.server";

export const Route = createFileRoute("/api")({
  server: {
    handlers: {
      GET: () => catalog(),
      OPTIONS: () => options(),
    },
  },
});
