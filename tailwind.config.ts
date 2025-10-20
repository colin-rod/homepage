import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Terracotta Midnight v2 Color Palette
        primary: {
          DEFAULT: "#20465B",
          dark: "#132C3D",
          light: "#2E6079",
        },
        accent: {
          warm: "#D3643E",
          "warm-dark": "#A84E2D",
          gold: "#C38A27",
        },
        bridge: {
          sage: "#7F9388",
          steel: "#426377",
        },
        neutral: {
          bg: "#FAF8F5",
          surface: "#FFFFFF",
        },
        text: {
          DEFAULT: "#222426",
          secondary: "#5A5F61",
          light: "#F7F9FA",
        },
        semantic: {
          success: "#4F8B6A",
          warning: "#D6A94E",
          error: "#C8533C",
          info: "#5F8FA6",
        },
        divider: "#E3E1DD",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Lora", "serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
