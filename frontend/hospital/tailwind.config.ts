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
        sand: {
          DEFAULT: "#E8DCC4",
          surface: "#F2EADA",
          high: "#DDD0B5",
        },
        forest: {
          DEFAULT: "#1F3D2B",
          surface: "#14281C",
          muted: "rgba(31, 61, 43, 0.65)",
          border: "rgba(31, 61, 43, 0.2)",
        },
        purple: {
          DEFAULT: "#8B5CF6",
          dark: "#7C3AED",
          glow: "rgba(139, 92, 246, 0.35)",
        },
        // Stitch Clinical Precision Operations Tokens
        "surface": "#fcf9f4",
        "surface-dim": "#dcdad5",
        "surface-bright": "#fcf9f4",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f6f3ee",
        "surface-container": "#f0ede9",
        "surface-container-high": "#ebe8e3",
        "surface-container-highest": "#e5e2dd",
        "on-surface": "#1c1c19",
        "on-surface-variant": "#424843",
        "inverse-surface": "#31302d",
        "inverse-on-surface": "#f3f0eb",
        "primary": "#082717",
        "on-primary": "#ffffff",
        "primary-container": "#1f3d2b",
        "on-primary-container": "#87a890",
        "primary-fixed": "#c8ebd1",
        "secondary": "#6b38d4",
        "on-secondary": "#ffffff",
        "secondary-container": "#8455ef",
        "secondary-fixed": "#e9ddff",
        "on-secondary-fixed": "#23005c",
        "on-secondary-container": "#fffbff",
      },
    },
  },
  plugins: [],
};

export default config;
