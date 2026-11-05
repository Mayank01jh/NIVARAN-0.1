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
        midnight: {
          DEFAULT: "#0B0B0C",
          surface: "#121316",
          card: "#181A1F",
          elevated: "#20232A",
        },
        white: "#FFFFFF",
        lime: {
          DEFAULT: "#C6F432",
          dark: "#AEE01E",
          glow: "rgba(198, 244, 50, 0.35)",
        },
      },
    },
  },
  plugins: [],
};

export default config;
