const envApiUrl = import.meta.env.VITE_API_URL;

export const API_BASE_URL = (envApiUrl || "http://localhost:3000").replace(/\/+$/, "");






