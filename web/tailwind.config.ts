import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "var(--color-bg)",
        ink: "var(--color-text)",
        inkSoft: "var(--color-text-soft)",
        inkFaint: "var(--color-text-faint)",
        accent: "var(--color-accent)",
        accentHover: "var(--color-accent-hover)",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      boxShadow: {
        // Soft elevated card
        "neu-flat": "5px 5px 12px var(--shadow-dark), -5px -5px 12px var(--shadow-light)",
        // Hover state (slight lift)
        "neu-lift": "8px 8px 18px var(--shadow-dark), -8px -8px 18px var(--shadow-light)",
        // Carved/Pressed inset for inputs & active buttons
        "neu-pressed": "inset 3px 3px 6px var(--shadow-dark), inset -3px -3px 6px var(--shadow-light)",
        // Subtle indicator pill shadow
        "neu-sm": "2px 2px 5px var(--shadow-dark), -2px -2px 5px var(--shadow-light)",
      },
      borderRadius: {
        card: "20px",
        pill: "9999px",
        btn: "14px"
      }
    }
  },
  plugins: []
};

export default config;