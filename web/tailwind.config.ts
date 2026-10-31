import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "var(--color-bg)",
        ink: "var(--color-text)",
        line: "var(--color-line)",
        inkSoft: "var(--color-text-soft)",
        inkFaint: "var(--color-text-faint)",
        amber: "#F2C46A",
        olive: "#AEAC78",
      },
      fontFamily: {
        sans: ["Inter", "Roboto", "Proxima Nova", "system-ui", "sans-serif"],
        display: ["Proxima Nova", "Inter", "Roboto", "sans-serif"]
      },
      boxShadow: {
        // Neumorphic raised effect (Cards)
        "neu-raised": "6px 6px 12px var(--shadow-dark), -6px -6px 12px var(--shadow-light)",
        // Neumorphic inset effect (Inputs)
        "neu-inset": "inset 4px 4px 8px var(--shadow-dark), inset -4px -4px 8px var(--shadow-light)",
        // Neumorphic button (smaller offset)
        "neu-button": "3px 3px 6px var(--shadow-dark), -3px -3px 6px var(--shadow-light)",
        // Neumorphic pressed button
        "neu-pressed": "inset 2px 2px 4px var(--shadow-dark), inset -2px -2px 4px var(--shadow-light)",
      },
      spacing: {
        gutter: "24px",
        card: "28px",
      }
    }
  },
  plugins: []
};

export default config;