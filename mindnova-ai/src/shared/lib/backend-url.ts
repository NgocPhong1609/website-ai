import { apiUrl } from "./api-url";

// Server requests and the Next.js proxy must use the same backend.
export function backendApiUrl(endpoint = ""): string {
  return apiUrl(process.env.BACKEND_URL || "http://127.0.0.1:8000", endpoint);
}
