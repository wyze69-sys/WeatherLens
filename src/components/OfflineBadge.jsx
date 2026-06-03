import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

function getLastUpdated(queryClient) {
  const latest = Math.max(0, ...queryClient.getQueryCache().findAll().map((query) => query.state.dataUpdatedAt || 0));
  return latest ? new Date(latest).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }) : "--:--";
}

function hasStaleQueries(queryClient) {
  return queryClient.getQueryCache().findAll().some((query) => query.isStale());
}

export function OfflineBadge() {
  const queryClient = useQueryClient();
  const [online, setOnline] = useState(() => navigator.onLine);
  const [lastUpdated, setLastUpdated] = useState(() => getLastUpdated(queryClient));
  const [stale, setStale] = useState(() => hasStaleQueries(queryClient));

  useEffect(() => {
    const refresh = () => {
      setOnline(navigator.onLine);
      setLastUpdated(getLastUpdated(queryClient));
      setStale(hasStaleQueries(queryClient));
    };
    const unsubscribe = queryClient.getQueryCache().subscribe(refresh);
    const timer = setInterval(refresh, 60000);
    window.addEventListener("online", refresh);
    window.addEventListener("offline", refresh);
    refresh();
    return () => {
      unsubscribe();
      clearInterval(timer);
      window.removeEventListener("online", refresh);
      window.removeEventListener("offline", refresh);
    };
  }, [queryClient]);

  if (online && !stale) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-field border border-border bg-elevated px-3 py-2 font-mono text-[11px] text-muted">
      Last updated: {lastUpdated} — {online ? "stale" : "offline"}
    </div>
  );
}
