import { useState, useEffect } from "react";

const STORAGE_KEY = "weatherlens_unit";

export function useUnit() {
  const [unit, setUnit] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || "metric";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, unit);
  }, [unit]);

  return { unit, setUnit };
}
