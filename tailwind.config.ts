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
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
        "7xl": ["4.5rem", { lineHeight: "1" }],
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
        glow: "0 0 15px rgba(211, 100, 62, 0.3)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
