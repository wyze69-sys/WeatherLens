# WeatherLens — Premium Weather Dashboard

A data-dense, bento-style weather intelligence dashboard built with React 18 and Vite. It prioritizes clarity, sleek aesthetics, and human-readable code.

## ✨ What's Inside

- **Bento Core:** A modular, grid-based layout that prioritizes the most important data (current status, 48-hour forecast).
- **Daylight Tracker:** A geometric SVG arc tracking the sun's journey, sunrise/sunset times, and total daylight duration.
- **Air Quality Gauge:** Real-time AQI monitoring with a full pollutant breakdown (PM2.5, PM10, NO2, O3) and health insights.
- **Cambodia First:** Built-in horizontal snap-scroll support for all 25 provinces.
- **Dynamic Theming:** Smooth transitions across different weather conditions (sunny, stormy, rainy, clouds).
- **Global Search:** Powered by OpenWeather reverse-geocoding, with a 5-city recent history cache.
- **Unit Toggle:** Instant °C/°F switching that persists between sessions.

## 🛠️ Stack

- **Core:** React 18, Vite
- **Data:** TanStack Query v5 (Caching & Background Refetching)
- **Validation:** Zod (Type-safe schemas for OpenWeather API)
- **Styles:** Tailwind CSS (Custom glass-morphism, animations, Inter font)
- **Extras:** Lucide React (Icons), Recharts (Area charts), date-fns.

## 🚀 Quick Start

1. **Install:** `npm install`
2. **Setup:** Add your `VITE_OPENWEATHER_API_KEY` to a `.env.local` file.
3. **Run:** `npm run dev`

Open [http://localhost:5173](http://localhost:5173) to see the magic.

## 🧩 Structure

```text
src/
  api/           # Async fetchers + Zod validation schemas
  components/    # Redesigned Bento widgets + UI modules
  hooks/         # Business logic: queries, unit state, search history
  lib/           # Theme logic + Cambodia province data
  main.jsx       # Entry point
```

---
*WeatherLens follows a "clean code" philosophy — no AI-fluff, no useless comments, just optimized, readable React.*
