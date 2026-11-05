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
        bright: {
          DEFAULT: "#FFFFFF",
          surface: "#F8F9FA",
          card: "#FFFFFF",
        },
        dark: {
          DEFAULT: "#0B0B0C",
          surface: "#121316",
          elevated: "#181A1F",
        },
        tactical: {
          DEFAULT: "#00652C",
          dark: "#004D20",
          light: "#E8F5E9",
        },
      },
    },
  },
  plugins: [],
};

export default config;
