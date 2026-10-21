const envApiUrl = import.meta.env.VITE_API_URL;

// Production builds call the API on the same origin ("/api/..."), which Netlify proxies to Render
// (see public/_redirects), so the auth cookie is first-party. Local dev talks to the backend directly.
// VITE_API_URL, when set, overrides both.
const defaultApiUrl = import.meta.env.DEV ? "http://localhost:3000" : "";

export const API_BASE_URL = (envApiUrl ?? defaultApiUrl).replace(/\/+$/, "");
