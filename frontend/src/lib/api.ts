const rawApiUrl = import.meta.env.VITE_API_URL;

const getDefaultApiUrl = (): string => {
  if (rawApiUrl) return rawApiUrl;
  
  // If running on a live domain (not localhost), fallback to hosted Render backend
  if (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
    return "https://learnopto-2.onrender.com";
  }

  return "http://localhost:3000";
};

export const API_BASE_URL = getDefaultApiUrl().replace(/\/+$/, "");


