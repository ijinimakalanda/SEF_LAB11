import { useState, useEffect } from "react";

// 1. Read the base API URL from environment variables. 
// Falls back to localhost:5000 for local development if the env var is missing.
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function useFetch(endpoint) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    
    // 2. Construct the full URL safely
    // If the endpoint already starts with "http", use it as-is. 
    // Otherwise, prepend the API_BASE_URL (e.g., "/api/menu" becomes "https://your-api.onrender.com/api/menu")
    const fullUrl = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;

    fetch(fullUrl)
      .then((res) => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then((json) => { if (active) setData(json); })
      .catch((err) => { if (active) setError(err.message); })
      .finally(() => { if (active) setIsLoading(false); });

    return () => { active = false; }; // cleanup
  }, [endpoint]);

  return { data, isLoading, error };
}