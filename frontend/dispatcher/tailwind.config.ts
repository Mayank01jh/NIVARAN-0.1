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
        midnight: {
          DEFAULT: "#0B0B0C",
          surface: "#121316",
          elevated: "#181A1F",
        },
        lime: {
          DEFAULT: "#C6F432",
          dark: "#AEE01E",
          glow: "rgba(198, 244, 50, 0.35)",
        },
        // Stitch Tactical Operations White Tokens
        "surface": "#f8f9ff",
        "surface-dim": "#cbdbf5",
        "surface-bright": "#f8f9ff",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#eff4ff",
        "surface-container": "#e5eeff",
        "surface-container-high": "#dce9ff",
        "surface-container-highest": "#d3e4fe",
        "on-surface": "#0b1c30",
        "on-surface-variant": "#3f493f",
        "inverse-surface": "#213145",
        "inverse-on-surface": "#eaf1ff",
        "primary": "#00652c",
        "on-primary": "#ffffff",
        "primary-container": "#15803d",
        "on-primary-container": "#d3ffd5",
        "primary-fixed": "#95f8a7",
        "secondary": "#416900",
        "on-secondary": "#ffffff",
        "secondary-container": "#acf847",
        "secondary-fixed": "#acf847",
        "secondary-fixed-dim": "#91db2a",
        "on-secondary-fixed": "#102000",
        "on-secondary-container": "#457000",
      },
    },
  },
  plugins: [],
};

export default config;
