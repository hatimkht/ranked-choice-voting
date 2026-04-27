import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Institutional palette: off-white surfaces, anthracite ink, muted blue accent.
        canvas: "#FAFAF7",
        surface: "#FFFFFF",
        ink: {
          DEFAULT: "#171B23",
          soft: "#3A4150",
          muted: "#6B7280",
        },
        line: {
          DEFAULT: "#E6E5DF",
          strong: "#D5D3CB",
        },
        accent: {
          DEFAULT: "#2C5282",
          soft: "#456FA0",
          pale: "#E8EFF7",
        },
        paper: {
          DEFAULT: "#FBF7EC",
          edge: "#E9E2CD",
          shadow: "#D9D2BB",
        },
        stamp: "#A2362F",
        warn: "#B45309",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Reduzierte, ruhigere Skala — eine Schrift, weniger Größenstufen.
        "display-1": ["clamp(2.1rem, 4.4vw, 3.4rem)", { lineHeight: "1.08", letterSpacing: "-0.025em" }],
        "display-2": ["clamp(1.65rem, 3vw, 2.2rem)", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        "headline": ["clamp(1.25rem, 1.9vw, 1.55rem)", { lineHeight: "1.25", letterSpacing: "-0.015em" }],
      },
      letterSpacing: {
        label: "0.12em",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(20, 25, 35, 0.04), 0 8px 24px rgba(20, 25, 35, 0.04)",
        card: "0 1px 2px rgba(20, 25, 35, 0.05), 0 12px 36px rgba(20, 25, 35, 0.06)",
        paper: "0 1px 0 rgba(0,0,0,0.04), 0 18px 40px -16px rgba(60, 50, 20, 0.18)",
      },
      borderRadius: {
        xl: "14px",
        "2xl": "18px",
      },
      transitionTimingFunction: {
        soft: "cubic-bezier(0.22, 0.61, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
