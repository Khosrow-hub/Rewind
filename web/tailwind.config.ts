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
        accent: "#E59866", // Warm terracotta
        accentHover: "#D35400",
      },
      fontFamily: {
        sans: ["Inter", "Roboto", "system-ui", "sans-serif"],
      },
      boxShadow: {
        // The magic Neumorphic shadows
        "neu-flat": "6px 6px 12px var(--shadow-dark), -6px -6px 12px var(--shadow-light)",
        "neu-pressed": "inset 6px 6px 12px var(--shadow-dark), inset -6px -6px 12px var(--shadow-light)",
        "neu-sm": "3px 3px 6px var(--shadow-dark), -3px -3px 6px var(--shadow-light)",
        "neu-sm-pressed": "inset 3px 3px 6px var(--shadow-dark), inset -3px -3px 6px var(--shadow-light)",
      },
      borderRadius: {
        card: "24px",
        pill: "999px"
      },
      spacing: {
        gutter: "24px",
        card: "32px",
      }
    }
  },
  plugins: []
};

export default config;