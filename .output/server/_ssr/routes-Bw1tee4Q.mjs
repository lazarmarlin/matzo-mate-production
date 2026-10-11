import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Send, r as Braces } from "../_libs/lucide-react.mjs";
import { i as previewPathPrefix, n as API_ROUTES, r as SERVICE_NAME } from "./router-CdLw9rEb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Bw1tee4Q.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function withPreviewPrefix(path) {
	if (typeof window === "undefined") return path;
	const prefix = previewPathPrefix(window.location.hostname, window.location.pathname);
	return prefix ? `${prefix}${path}` : path;
}
function resolvePath(route, id, query) {
	const safeId = encodeURIComponent(id.trim() || "missing-id");
	let path = route.path.replace("$id", safeId);
	const isList = route.path === "/api/records" || route.path === "/api/records.json";
	const q = query.trim();
	if (isList && q) path += `?q=${encodeURIComponent(q)}`;
	return path;
}
function curlLine(route, path, body) {
	if (route.method === "GET") return `curl -s ${path}`;
	if (route.method === "DELETE") return `curl -s -X DELETE ${path}`;
	const compact = body.replace(/\s+/g, " ").trim();
	return `curl -s -X ${route.method} ${path} -H 'content-type: application/json' -d '${compact}'`;
}
function Home() {
	const [selected, setSelected] = (0, import_react.useState)(0);
	const [id, setId] = (0, import_react.useState)("");
	const [query, setQuery] = (0, import_react.useState)("");
	const [body, setBody] = (0, import_react.useState)(API_ROUTES.find((route) => route.body)?.body ?? "");
	const [status, setStatus] = (0, import_react.useState)(null);
	const [payload, setPayload] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [problem, setProblem] = (0, import_react.useState)(null);
	const route = API_ROUTES[selected] ?? API_ROUTES[0];
	const needsId = route.path.includes("$id");
	const needsQuery = route.path === "/api/records" || route.path === "/api/records.json";
	const needsBody = route.method === "POST" || route.method === "PUT";
	const resolved = resolvePath(route, id, query);
	function pick(index) {
		const next = API_ROUTES[index];
		setSelected(index);
		setStatus(null);
		setProblem(null);
		setPayload("");
		if (next?.body) setBody(next.body);
	}
	async function send(event) {
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
				headers: needsBody ? { "content-type": "application/json" } : void 0,
				body: needsBody ? body : void 0
			});
			const text = await response.text();
			let pretty = text;
			try {
				pretty = JSON.stringify(JSON.parse(text), null, 2);
			} catch {}
			setStatus(response.status);
			setPayload(pretty);
			if (route.path === "/api/records" && route.method === "GET") {
				const first = JSON.parse(text).records?.[0]?.id;
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "min-h-screen bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "border-b border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-6xl items-center gap-4 px-4 py-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex size-11 items-center justify-center rounded-card bg-accent text-accent-ink",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Braces, {
						className: "size-5",
						"aria-hidden": "true"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-balance text-2xl font-semibold tracking-tight",
						children: SERVICE_NAME
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-pretty text-sm text-muted",
						children: "JSON routes for records. Same paths answer on Render."
					})]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-6xl gap-4 px-4 py-5 lg:grid-cols-[17rem_minmax(0,1fr)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				"aria-label": "JSON routes",
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 font-mono text-xs tracking-wide text-muted uppercase",
					children: "Routes"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible",
					children: API_ROUTES.map((item, index) => {
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "shrink-0 lg:shrink",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => pick(index),
								className: "flex min-h-11 w-full items-center gap-2 rounded-card border px-3 py-2 text-left " + (index === selected ? "border-accent bg-accent text-accent-ink" : "border-border bg-surface text-fg hover:bg-surface-2"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-14 shrink-0 font-mono text-xs font-medium",
									children: item.method
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate font-mono text-xs",
									children: item.path
								})]
							})
						}, `${item.method} ${item.path}`);
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "min-w-0 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: send,
						className: "space-y-4 rounded-card border border-border bg-surface p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-balance text-lg font-semibold",
								children: route.summary
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 font-mono text-sm break-all text-muted",
								children: resolved
							})] }),
							needsId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm text-muted",
									children: "Record id"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: id,
									onChange: (event) => setId(event.target.value),
									placeholder: "from the list",
									className: "h-11 w-full rounded-card border border-border bg-bg px-3 font-mono text-sm text-fg",
									autoCapitalize: "off",
									autoCorrect: "off",
									spellCheck: false
								})]
							}) : null,
							needsQuery ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm text-muted",
									children: "Search query"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: query,
									onChange: (event) => setQuery(event.target.value),
									placeholder: "optional",
									className: "h-11 w-full rounded-card border border-border bg-bg px-3 font-mono text-sm text-fg"
								})]
							}) : null,
							needsBody ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm text-muted",
									children: "JSON body"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									value: body,
									onChange: (event) => setBody(event.target.value),
									rows: 6,
									className: "w-full rounded-card border border-border bg-bg p-3 font-mono text-sm text-fg",
									spellCheck: false
								})]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "submit",
									disabled: busy,
									className: "inline-flex h-11 items-center gap-2 rounded-card bg-accent px-4 font-medium text-accent-ink disabled:opacity-60",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, {
										className: "size-4",
										"aria-hidden": "true"
									}), busy ? "Sending" : "Send"]
								}), problem ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-danger",
									children: problem
								}) : null]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "overflow-hidden rounded-card border border-border bg-surface",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3 border-b border-border px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-xs tracking-wide text-muted uppercase",
								children: "Response"
							}), status !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-sm tabular-nums " + (ok ? "text-accent" : "text-danger"),
								children: status
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: "Waiting"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
							className: "max-h-[28rem] overflow-auto p-4 font-mono text-sm leading-relaxed text-pretty text-fg",
							children: payload || "Send a route. JSON shows up here."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-xs break-all text-muted",
						children: curlLine(route, resolved, body)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-pretty text-sm text-muted",
						children: "Records stay in the running server process. A restart clears them. Paths ending in .json return the same JSON as the plain path."
					})
				]
			})]
		})]
	});
}
//#endregion
export { Home as component };
