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
          DEFAULT: "#FF6B5B",
          pressed: "#E55343",
          glow: "rgba(255, 107, 91, 0.35)",
        },
      },
    },
  },
  plugins: [],
};

export default config;
