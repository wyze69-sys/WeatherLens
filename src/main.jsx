import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.jsx'
import { ErrorBoundary } from './components/ErrorBoundary.jsx'
import './index.css'

const queryClient = new QueryClient();

const PERSIST_KEY = "weatherlens_query_cache";
const persisted = localStorage.getItem(PERSIST_KEY);
if (persisted) {
  try {
    const entries = JSON.parse(persisted);
    entries.forEach(({ queryKey, data, dataUpdatedAt }) => {
      queryClient.setQueryData(queryKey, data, { updatedAt: dataUpdatedAt });
    });
  } catch {
    localStorage.removeItem(PERSIST_KEY);
  }
}

queryClient.getQueryCache().subscribe(() => {
  const entries = queryClient
    .getQueryCache()
    .findAll()
    .filter((query) => query.state.status === "success")
    .map((query) => ({
      queryKey: query.queryKey,
      data: query.state.data,
      dataUpdatedAt: query.state.dataUpdatedAt,
    }));
  localStorage.setItem(PERSIST_KEY, JSON.stringify(entries));
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js");
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>,
)
