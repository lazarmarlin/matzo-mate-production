import { z } from "zod";
import { API_ROUTES, SERVICE_NAME } from "@/lib/json-catalog";
import {
  createRecord,
  deleteRecord,
  findRecord,
  listRecords,
  replaceRecord,
  uptimeSeconds,
} from "@/lib/json-store.server";

const CORS: Record<string, string> = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type",
  "access-control-max-age": "86400",
  "cache-control": "no-store",
};

const RecordBody = z.object({
  title: z.string().trim().min(1).max(80),
  body: z.string().trim().max(2000).optional(),
});

export function json(data: unknown, status = 200): Response {
  return Response.json(data, { status, headers: CORS });
}

export function options(): Response {
  return new Response(null, { status: 204, headers: CORS });
}

export function catalog(): Response {
  return json({
    service: SERVICE_NAME,
    routes: API_ROUTES.map(({ method, path, summary }) => ({ method, path, summary })),
  });
}

export function health(): Response {
  return json({
    ok: true,
    service: SERVICE_NAME,
    uptimeSeconds: uptimeSeconds(),
    time: new Date().toISOString(),
  });
}

function searchQuery(request: Request): string {
  return new URL(request.url).searchParams.get("q") ?? "";
}

export function list(request: Request): Response {
  const q = searchQuery(request);
  const records = listRecords(q);
  return json({ records, count: records.length, q });
}

export function readOne(id: string): Response {
  const record = findRecord(id);
  if (!record) {
    return json({ error: "not_found", message: "No record with that id." }, 404);
  }
  return json({ record });
}

async function readBody(request: Request): Promise<
  | { ok: true; title: string; body: string }
  | { ok: false; response: Response }
> {
  let data: unknown;
  try {
    data = await request.json();
  } catch {
    return {
      ok: false,
      response: json({ error: "bad_request", message: "Body must be JSON." }, 400),
    };
  }
  const parsed = RecordBody.safeParse(data);
  if (!parsed.success) {
    return {
      ok: false,
      response: json(
        {
          error: "bad_request",
          message: "Need a title (1–80 characters). Body is optional, up to 2000.",
          issues: parsed.error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        },
        400,
      ),
    };
  }
  return { ok: true, title: parsed.data.title, body: parsed.data.body ?? "" };
}

export async function create(request: Request): Promise<Response> {
  const parsed = await readBody(request);
  if (!parsed.ok) return parsed.response;
  const record = createRecord(parsed.title, parsed.body);
  return json({ record }, 201);
}

export async function replace(id: string, request: Request): Promise<Response> {
  const parsed = await readBody(request);
  if (!parsed.ok) return parsed.response;
  const record = replaceRecord(id, parsed.title, parsed.body);
  if (!record) {
    return json({ error: "not_found", message: "No record with that id." }, 404);
  }
  return json({ record });
}

export function remove(id: string): Response {
  if (!deleteRecord(id)) {
    return json({ error: "not_found", message: "No record with that id." }, 404);
  }
  return json({ deleted: true, id });
}
