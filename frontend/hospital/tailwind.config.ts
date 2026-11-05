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
      },
    },
  },
  plugins: [],
};

export default config;
