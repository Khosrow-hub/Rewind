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
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem", letterSpacing: "0.02em" }],
        xs: ["0.75rem", { lineHeight: "1.1rem" }],
        sm: ["0.875rem", { lineHeight: "1.35rem" }],
        base: ["1rem", { lineHeight: "1.6rem" }],
        lg: ["1.125rem", { lineHeight: "1.7rem" }],
        xl: ["1.375rem", { lineHeight: "1.9rem" }],
        "2xl": ["1.75rem", { lineHeight: "2.2rem" }],
        "3xl": ["2.25rem", { lineHeight: "2.6rem" }],
        "4xl": ["3rem", { lineHeight: "3.2rem", letterSpacing: "-0.01em" }],
        "5xl": ["3.75rem", { lineHeight: "3.8rem", letterSpacing: "-0.015em" }]
      },
      borderRadius: {
        card: "20px",
        pill: "999px"
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)",
        lift: "0 2px 4px rgba(0,0,0,0.06), 0 16px 40px rgba(0,0,0,0.10)"
      },
      spacing: {
        gutter: "24px",
        card: "20px",
      }
    }
  },
  plugins: []
};

export default config;