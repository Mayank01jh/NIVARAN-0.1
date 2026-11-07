import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        headline: ["Plus Jakarta Sans", "sans-serif"],
        display: ["Playfair Display", "serif"],
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        cream: {
          DEFAULT: "#F4EDE0",
          surface: "#FAF5EC",
          high: "#EDE5D6",
        },
        navy: {
          DEFAULT: "#14213D",
          surface: "#0E182D",
          muted: "rgba(20, 33, 61, 0.65)",
          border: "rgba(20, 33, 61, 0.15)",
        },
        coral: {
          DEFAULT: "#B91C1C",
          pressed: "#991B1B",
          glow: "rgba(185, 28, 28, 0.35)",
        },
        // Stitch Warm Editorial Healthcare Tokens
        "surface": "#fff9ee",
        "surface-dim": "#e0d9cd",
        "surface-bright": "#fff9ee",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#faf3e6",
        "surface-container": "#f4ede0",
        "surface-container-high": "#eee7db",
        "surface-container-highest": "#e9e2d5",
        "on-surface": "#1e1b14",
        "on-surface-variant": "#45464d",
        "inverse-surface": "#333028",
        "inverse-on-surface": "#f7f0e3",
        "primary": "#000a24",
        "on-primary": "#ffffff",
        "primary-container": "#14213d",
        "on-primary-container": "#7c89aa",
        "secondary": "#ae3026",
        "on-secondary": "#ffffff",
        "secondary-container": "#fc6959",
        "secondary-fixed": "#ffdad5",
        "on-secondary-fixed": "#410001",
        "secondary-fixed-dim": "#ffb4aa",
        "tertiary": "#130900",
        "tertiary-container": "#321d00",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#a58359",
      },
    },
  },
  plugins: [],
};

export default config;
