const rawApiUrl = import.meta.env.VITE_API_URL;

if (import.meta.env.PROD && !rawApiUrl) {
  console.warn(
    "[LearnOpto API] VITE_API_URL environment variable is not defined at build time. " +
    "Defaulting API_BASE_URL to http://localhost:3000. Ensure VITE_API_URL is set in your host build settings (e.g. Render/Vercel)."
  );
}

export const API_BASE_URL = (rawApiUrl || "http://localhost:3000").replace(/\/+$/, "");

