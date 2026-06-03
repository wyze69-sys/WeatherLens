/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B0E13",
        surface: "#141821",
        elevated: "#1A1F29",
        foreground: "#E8EAED",
        muted: "#9AA0A6",
        border: "#252B36",
        "accent-sky": "#7DD3FC",
        "accent-sun": "#FACC15",
        danger: "#EF4444",
        card: "#141821",
        "card-foreground": "#E8EAED",
      },
      fontFamily: {
        sans: ['"General Sans"', "system-ui"],
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", '"Liberation Mono"', "monospace"],
      },
      borderRadius: {
        field: "8px",
      },
    },
  },
  plugins: [],
}
