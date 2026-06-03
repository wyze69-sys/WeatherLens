import { useState, useEffect, useRef } from "react";
import { Search, Loader2, MapPin, X, Crosshair } from "lucide-react";
import { useCitySearch } from "../hooks/useWeather";
import { useSearchHistory } from "../hooks/useSearchHistory";

const iconProps = {
  size: 20,
  strokeWidth: 1.75,
};

export function SearchAutocomplete({ onLocationSelect }) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [geoState, setGeoState] = useState("idle");
  const wrapperRef = useRef(null);

  const { data: results, isLoading, isError } = useCitySearch(debouncedQuery);
  const { history, addCity, removeCity } = useSearchHistory();

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setGeoState("error");
      return;
    }
    setGeoState("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoState("idle");
        onLocationSelect(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setGeoState("denied");
        } else {
          setGeoState("error");
        }
        setTimeout(() => setGeoState("idle"), 3000);
      },
      { timeout: 10000 }
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (city) => {
    addCity(city);
    onLocationSelect(city.lat, city.lon);
    setQuery("");
    setIsOpen(false);
  };

  const geoTitle =
    geoState === "denied" ? "Location access denied" :
    geoState === "error" ? "Location unavailable" :
    "Use my current location";

  return (
    <div className="relative z-50 mx-auto w-full max-w-md">
      <div ref={wrapperRef} className="relative">
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" {...iconProps} />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder="Search for a city..."
              className="w-full rounded-field border border-border bg-elevated py-3 pl-10 pr-4 text-foreground outline-none transition-colors duration-150 placeholder:text-muted focus:border-accent-sky"
              aria-label="Search city"
            />
            {isLoading && query.length >= 2 && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-muted" {...iconProps} />
            )}
          </div>

          <button
            onClick={handleLocateMe}
            disabled={geoState === "loading"}
            title={geoTitle}
            aria-label={geoTitle}
            className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-field border transition-colors duration-150 ${
              geoState === "denied" || geoState === "error"
                ? "border-danger bg-elevated text-red-300 cursor-not-allowed"
                : "border-border bg-elevated text-muted hover:border-accent-sky hover:text-accent-sky"
            }`}
          >
            {geoState === "loading" ? (
              <Loader2 className="animate-spin" {...iconProps} />
            ) : (
              <Crosshair {...iconProps} />
            )}
          </button>
        </div>

        {isOpen && (query.length >= 2 || history.length > 0) && (
          <div className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-field border border-border bg-elevated">
            {query.length >= 2 && results && results.length > 0 && (
              <div className="max-h-60 overflow-y-auto">
                <div className="px-4 pb-2 pt-3 field-label">
                  Search Results
                </div>
                {results.map((city, idx) => (
                  <button
                    key={`${city.lat}-${city.lon}-${idx}`}
                    onClick={() => handleSelect(city)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors duration-150 hover:bg-surface"
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="text-muted" size={18} strokeWidth={1.75} />
                      <div>
                        <span className="font-medium text-foreground">{city.name}</span>
                        {(city.state || city.country) && (
                          <span className="ml-2 text-sm text-muted">
                            {city.state ? `${city.state}, ` : ""}{city.country}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {query.length >= 2 && !isLoading && !isError && results?.length === 0 && (
              <div className="px-4 py-4 text-center text-sm text-muted">
                No cities found matching "{query}"
              </div>
            )}

            {!query && history.length > 0 && (
              <div className="max-h-60 overflow-y-auto pb-2">
                <div className="px-4 pb-2 pt-3 field-label">
                  Recent Searches
                </div>
                {history.slice(0, 5).map((city) => (
                  <div
                    key={`hist-${city.lat}-${city.lon}`}
                    className="flex w-full items-center justify-between px-4 py-2 text-left transition-colors duration-150 hover:bg-surface"
                  >
                    <button
                      className="flex flex-1 items-center gap-3 text-left"
                      onClick={() => {
                        onLocationSelect(city.lat, city.lon);
                        setIsOpen(false);
                      }}
                    >
                      <MapPin className="text-muted" size={18} strokeWidth={1.75} />
                      <span className="font-medium text-foreground">{city.name}</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCity(city.lat, city.lon);
                      }}
                      className="rounded-md p-1 text-muted transition-colors duration-150 hover:text-foreground"
                      aria-label="Remove from history"
                    >
                      <X size={18} strokeWidth={1.75} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
