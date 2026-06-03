import { Component } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export class ErrorBoundary extends Component {
  state = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="field-panel flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
          <AlertTriangle className="mb-4 text-accent-sun" size={20} strokeWidth={1.75} />
          <h2 className="mb-2 text-2xl font-semibold">Something went wrong</h2>
          <p className="mb-6 max-w-md text-sm text-muted">
            {this.state.error?.message || "An unexpected error occurred while rendering the dashboard."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 rounded-md bg-accent-sky px-4 py-2 font-medium text-black transition-colors duration-150 hover:bg-sky-300"
          >
            <RefreshCcw size={18} strokeWidth={1.75} />
            Reload Dashboard
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
