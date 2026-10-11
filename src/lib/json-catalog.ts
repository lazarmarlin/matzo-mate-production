export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export type ApiRoute = {
  method: HttpMethod;
  path: string;
  summary: string;
  /** Example JSON body. Present only when the route reads one. */
  body?: string;
};

export const SERVICE_NAME = "Kiln";

/** Static contract. Safe to import from the browser and the server. */
export const API_ROUTES: ApiRoute[] = [
  { method: "GET", path: "/api", summary: "Every JSON route this service serves." },
  { method: "GET", path: "/api/health", summary: "Liveness check. Render pings this." },
  {
    method: "GET",
    path: "/api/records",
    summary: "List records. Add ?q= to search title and body.",
  },
  {
    method: "GET",
    path: "/api/records.json",
    summary: "Same list, on a .json path.",
  },
  {
    method: "POST",
    path: "/api/records",
    summary: "Create a record.",
    body: '{\n  "title": "Field note",\n  "body": "Clay from the west bank."\n}',
  },
  { method: "GET", path: "/api/records/$id", summary: "Fetch one record by id." },
  {
    method: "GET",
    path: "/api/records/$id.json",
    summary: "Same record, on a .json path.",
  },
  {
    method: "PUT",
    path: "/api/records/$id",
    summary: "Replace title and body.",
    body: '{\n  "title": "Revised note",\n  "body": "Moved to the top shelf."\n}',
  },
  { method: "DELETE", path: "/api/records/$id", summary: "Remove a record." },
];
