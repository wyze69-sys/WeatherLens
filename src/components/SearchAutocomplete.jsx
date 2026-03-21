import { useState, useEffect, useRef } from "react";
import { Search, Loader2, MapPin, X, Crosshair } from "lucide-react";
import { useCitySearch } from "../hooks/useWeather";
import { useSearchHistory } from "../hooks/useSearchHistory";

export function SearchAutocomplete({ onLocationSelect }) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [geoState, setGeoState] = useState("idle"); // idle | loading | denied | error
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
        // Revert to idle after 3s so user can try again
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
    <div className="w-full max-w-md mx-auto relative z-50">
      <div ref={wrapperRef} className="relative">
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 opacity-60" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder="Search for a city..."
              className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl outline-none focus:ring-2 focus:ring-white/40 shadow-sm transition-all text-current placeholder:text-current placeholder:opacity-60"
              aria-label="Search city"
            />
            {isLoading && query.length >= 2 && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin opacity-60" />
            )}
          </div>

          {/* Locate Me button */}
          <button
            onClick={handleLocateMe}
            disabled={geoState === "loading"}
            title={geoTitle}
            aria-label={geoTitle}
            className={`flex-shrink-0 w-11 h-11 rounded-2xl border flex items-center justify-center transition-all ${
              geoState === "denied" || geoState === "error"
                ? "bg-red-500/20 border-red-400/40 text-red-200 cursor-not-allowed"
                : "bg-white/10 border-white/20 hover:bg-white/25 hover:border-white/40"
            }`}
          >
            {geoState === "loading" ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Crosshair className="w-5 h-5" />
            )}
          </button>
        </div>

        {isOpen && (query.length >= 2 || history.length > 0) && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white/20 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl overflow-hidden glass-dropdown">
            {query.length >= 2 && results && results.length > 0 && (
              <div className="max-h-60 overflow-y-auto">
                <div className="px-4 pt-3 pb-2 text-xs font-semibold uppercase tracking-wider opacity-70">
                  Search Results
                </div>
                {results.map((city, idx) => (
                  <button
                    key={`${city.lat}-${city.lon}-${idx}`}
                    onClick={() => handleSelect(city)}
                    className="w-full text-left px-4 py-3 hover:bg-white/10 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 opacity-60" />
                      <div>
                        <span className="font-medium">{city.name}</span>
                        {(city.state || city.country) && (
                          <span className="text-sm opacity-70 ml-2">
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
              <div className="px-4 py-4 text-center opacity-70 text-sm">
                No cities found matching "{query}"
              </div>
            )}

            {!query && history.length > 0 && (
              <div className="max-h-60 overflow-y-auto pb-2">
                <div className="px-4 pt-3 pb-2 text-xs font-semibold uppercase tracking-wider opacity-70">
                  Recent Searches
                </div>
                {history.map((city) => (
                  <div
                    key={`hist-${city.lat}-${city.lon}`}
                    className="w-full text-left px-4 py-2 hover:bg-white/10 flex items-center justify-between group transition-colors"
                  >
                    <button
                      className="flex-1 flex items-center gap-3 text-left"
                      onClick={() => {
                        onLocationSelect(city.lat, city.lon);
                        setIsOpen(false);
                      }}
                    >
                      <MapPin className="w-4 h-4 opacity-60" />
                      <span className="font-medium">{city.name}</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCity(city.lat, city.lon);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/20 rounded-full transition-all"
                      aria-label="Remove from history"
                    >
                      <X className="w-4 h-4" />
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
