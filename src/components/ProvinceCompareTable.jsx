const dash = "--";

export function ProvinceCompareTable({ provinces, unit, onSelectProvince, onTogglePin }) {
  const tempUnit = unit === "metric" ? "°C" : "°F";
  const windUnit = unit === "metric" ? "m/s" : "mph";

  return (
    <div className="overflow-x-auto pb-2 text-sm">
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            <th className="p-2">Province</th>
            <th className="p-2">Temp</th>
            <th className="p-2">Rain%</th>
            <th className="p-2">AQI</th>
            <th className="p-2">Wind</th>
          </tr>
        </thead>
        <tbody>
          {provinces.map((province, index) => (
            <tr key={province.name} className={`${index % 2 === 0 ? "bg-surface" : "bg-background"} border-b border-border`}>
              <td className="p-2">
                <button className="text-left font-medium text-foreground" onClick={() => onSelectProvince(province)}>{province.name}</button>
                <button className="ml-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-accent-sky" onClick={() => onTogglePin(province)}>Unpin</button>
              </td>
              <td className="p-2 font-mono tabular-nums text-accent-sky">{Number.isFinite(province.temp) ? `${Math.round(province.temp)}${tempUnit}` : dash}</td>
              <td className="p-2 font-mono tabular-nums text-foreground">{Number.isFinite(province.rain) ? `${Math.round(province.rain * 100)}%` : dash}</td>
              <td className="p-2 font-mono tabular-nums text-foreground">{Number.isFinite(province.aqi) ? province.aqi : dash}</td>
              <td className="p-2 font-mono tabular-nums text-foreground">{Number.isFinite(province.wind) ? `${Math.round(province.wind)} ${windUnit}` : dash}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
