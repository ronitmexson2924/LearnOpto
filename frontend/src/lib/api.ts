const rawApiUrl = import.meta.env.VITE_API_URL;

const getDefaultApiUrl = (): string => {
  if (rawApiUrl) return rawApiUrl;

  // In local development (localhost / 127.0.0.1), use local backend on port 3000
  if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
    return "http://localhost:3000";
  }

  // In production (Netlify / live domain), default to hosted Render backend
  return "https://learnopto-2.onrender.com";
};

export const API_BASE_URL = getDefaultApiUrl().replace(/\/+$/, "");




