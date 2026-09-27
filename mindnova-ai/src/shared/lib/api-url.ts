/** Accept a backend origin or an API root, with exactly one /api prefix. */
export function apiUrl(base: string, endpoint = ""): string {
  const root = base.trim().replace(/\/+$/, "").replace(/\/api$/, "");
  const path = endpoint.replace(/^\/+/, "").replace(/^api(?=\/|[?#]|$)/, "").replace(/^\/+/, "");
  return `${root}/api${path ? `${/^[?#]/.test(path) ? "" : "/"}${path}` : ""}`;
}

/** An empty public URL uses the Next.js same-origin API proxy. */
export function clientApiUrl(endpoint = ""): string {
  return apiUrl(process.env.NEXT_PUBLIC_API_URL || "", endpoint);
}
