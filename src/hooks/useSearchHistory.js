import { useState, useEffect } from "react";

const MAX_HISTORY = 5;
const STORAGE_KEY = "weatherlens_history";

export function useSearchHistory() {
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const addCity = (city) => {
    setHistory((prev) => {
      const filtered = prev.filter(
        (c) => c.lat !== city.lat && c.lon !== city.lon
      );
      return [city, ...filtered].slice(0, MAX_HISTORY);
    });
  };

  const removeCity = (lat, lon) => {
    setHistory((prev) => prev.filter((c) => c.lat !== lat || c.lon !== lon));
  };

  return { history, addCity, removeCity };
}
