import { createFileRoute } from "@tanstack/react-router";
import { options, readOne, remove, replace } from "@/lib/json-http.server";

export const Route = createFileRoute("/api/records/$id")({
  server: {
    handlers: {
      GET: ({ params }) => readOne(params.id.replace(/\.json$/, "")),
      PUT: ({ params, request }) => replace(params.id, request),
      DELETE: ({ params }) => remove(params.id),
      OPTIONS: () => options(),
    },
  },
});
