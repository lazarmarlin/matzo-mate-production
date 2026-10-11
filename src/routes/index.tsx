import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Braces, Send } from "lucide-react";
import { API_ROUTES, SERVICE_NAME, type ApiRoute } from "@/lib/json-catalog";
import { previewPathPrefix } from "@/lib/preview-path-prefix";

export const Route = createFileRoute("/")({ component: Home });

function withPreviewPrefix(path: string): string {
  if (typeof window === "undefined") return path;
  const prefix = previewPathPrefix(window.location.hostname, window.location.pathname);
  return prefix ? `${prefix}${path}` : path;
}

function resolvePath(route: ApiRoute, id: string, query: string): string {
  const safeId = encodeURIComponent(id.trim() || "missing-id");
  let path = route.path.replace("$id", safeId);
  const isList = route.path === "/api/records" || route.path === "/api/records.json";
  const q = query.trim();
  if (isList && q) path += `?q=${encodeURIComponent(q)}`;
  return path;
}

function curlLine(route: ApiRoute, path: string, body: string): string {
  if (route.method === "GET") return `curl -s ${path}`;
  if (route.method === "DELETE") return `curl -s -X DELETE ${path}`;
  const compact = body.replace(/\s+/g, " ").trim();
  return `curl -s -X ${route.method} ${path} -H 'content-type: application/json' -d '${compact}'`;
}

function Home() {
  const [selected, setSelected] = useState(0);
  const [id, setId] = useState("");
  const [query, setQuery] = useState("");
  const [body, setBody] = useState(API_ROUTES.find((route) => route.body)?.body ?? "");
  const [status, setStatus] = useState<number | null>(null);
  const [payload, setPayload] = useState("");
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);

  const route = API_ROUTES[selected] ?? API_ROUTES[0];
  const needsId = route.path.includes("$id");
  const needsQuery = route.path === "/api/records" || route.path === "/api/records.json";
  const needsBody = route.method === "POST" || route.method === "PUT";
  const resolved = resolvePath(route, id, query);

  function pick(index: number) {
    const next = API_ROUTES[index];
    setSelected(index);
    setStatus(null);
    setProblem(null);
    setPayload("");
    if (next?.body) setBody(next.body);
  }

  async function send(event: FormEvent) {
    event.preventDefault();
    if (needsId && !id.trim()) {
      setProblem("Need an id. List records first, then paste one.");
      setStatus(null);
      setPayload("");
      return;
    }
    setBusy(true);
    setProblem(null);
    try {
      const response = await fetch(withPreviewPrefix(resolved), {
        method: route.method,
        headers: needsBody ? { "content-type": "application/json" } : undefined,
        body: needsBody ? body : undefined,
      });
      const text = await response.text();
      let pretty = text;
      try {
        pretty = JSON.stringify(JSON.parse(text), null, 2);
      } catch {
        /* keep raw text */
      }
      setStatus(response.status);
      setPayload(pretty);
      if (route.path === "/api/records" && route.method === "GET") {
        const data = JSON.parse(text) as { records?: { id: string }[] };
        const first = data.records?.[0]?.id;
        if (first && !id.trim()) setId(first);
      }
    } catch {
      setStatus(null);
      setPayload("");
      setProblem("Request failed before a JSON body came back.");
    } finally {
      setBusy(false);
    }
  }

  const ok = status !== null && status < 400;

  return (
    <main className="min-h-screen bg-bg text-fg">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-5">
          <span className="flex size-11 items-center justify-center rounded-card bg-accent text-accent-ink">
            <Braces className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h1 className="text-balance text-2xl font-semibold tracking-tight">{SERVICE_NAME}</h1>
            <p className="text-pretty text-sm text-muted">
              JSON routes for records. Same paths answer on Render.
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-5 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <nav aria-label="JSON routes" className="min-w-0">
          <p className="mb-2 font-mono text-xs tracking-wide text-muted uppercase">Routes</p>
          <ul className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
            {API_ROUTES.map((item, index) => {
              const active = index === selected;
              return (
                <li key={`${item.method} ${item.path}`} className="shrink-0 lg:shrink">
                  <button
                    type="button"
                    onClick={() => pick(index)}
                    className={
                      "flex min-h-11 w-full items-center gap-2 rounded-card border px-3 py-2 text-left " +
                      (active
                        ? "border-accent bg-accent text-accent-ink"
                        : "border-border bg-surface text-fg hover:bg-surface-2")
                    }
                  >
                    <span className="w-14 shrink-0 font-mono text-xs font-medium">{item.method}</span>
                    <span className="truncate font-mono text-xs">{item.path}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <section className="min-w-0 space-y-4">
          <form
            onSubmit={send}
            className="space-y-4 rounded-card border border-border bg-surface p-4"
          >
            <div>
              <h2 className="text-balance text-lg font-semibold">{route.summary}</h2>
              <p className="mt-1 font-mono text-sm break-all text-muted">{resolved}</p>
            </div>

            {needsId ? (
              <label className="block space-y-1">
                <span className="text-sm text-muted">Record id</span>
                <input
                  value={id}
                  onChange={(event) => setId(event.target.value)}
                  placeholder="from the list"
                  className="h-11 w-full rounded-card border border-border bg-bg px-3 font-mono text-sm text-fg"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                />
              </label>
            ) : null}

            {needsQuery ? (
              <label className="block space-y-1">
                <span className="text-sm text-muted">Search query</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="optional"
                  className="h-11 w-full rounded-card border border-border bg-bg px-3 font-mono text-sm text-fg"
                />
              </label>
            ) : null}

            {needsBody ? (
              <label className="block space-y-1">
                <span className="text-sm text-muted">JSON body</span>
                <textarea
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  rows={6}
                  className="w-full rounded-card border border-border bg-bg p-3 font-mono text-sm text-fg"
                  spellCheck={false}
                />
              </label>
            ) : null}

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={busy}
                className="inline-flex h-11 items-center gap-2 rounded-card bg-accent px-4 font-medium text-accent-ink disabled:opacity-60"
              >
                <Send className="size-4" aria-hidden="true" />
                {busy ? "Sending" : "Send"}
              </button>
              {problem ? <p className="text-sm text-danger">{problem}</p> : null}
            </div>
          </form>

          <div className="overflow-hidden rounded-card border border-border bg-surface">
            <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
              <p className="font-mono text-xs tracking-wide text-muted uppercase">Response</p>
              {status !== null ? (
                <p
                  className={
                    "font-mono text-sm tabular-nums " + (ok ? "text-accent" : "text-danger")
                  }
                >
                  {status}
                </p>
              ) : (
                <p className="text-sm text-muted">Waiting</p>
              )}
            </div>
            <pre className="max-h-[28rem] overflow-auto p-4 font-mono text-sm leading-relaxed text-pretty text-fg">
              {payload || "Send a route. JSON shows up here."}
            </pre>
          </div>

          <p className="font-mono text-xs break-all text-muted">{curlLine(route, resolved, body)}</p>
          <p className="text-pretty text-sm text-muted">
            Records stay in the running server process. A restart clears them. Paths ending in
            .json return the same JSON as the plain path.
          </p>
        </section>
      </div>
    </main>
  );
}
