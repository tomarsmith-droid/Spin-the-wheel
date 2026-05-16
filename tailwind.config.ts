import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#E6EDF5",
          100: "#C2D1E5",
          200: "#88A4CB",
          300: "#4D77B0",
          400: "#2E5896",
          500: "#002B5F",
          600: "#002550",
          700: "#001E42",
          800: "#001733",
          900: "#000F22",
          950: "#000814",
        },
        gold: {
          50: "#FFFAE6",
          100: "#FFF3C2",
          200: "#FFE885",
          300: "#FFDE4D",
          400: "#FFD428",
          500: "#F5C400",
          600: "#C99F00",
          700: "#9C7B00",
          800: "#6F5700",
          900: "#423400",
        },
        ink: {
          50: "#F7F8FA",
          100: "#EDEFF3",
          200: "#D7DBE3",
          300: "#A8B0BF",
          400: "#6F7787",
          500: "#4A5160",
          600: "#2E3340",
          700: "#1E2230",
          800: "#141826",
          900: "#0A0E1A",
          950: "#05080F",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui"],
        display: ["var(--font-display)", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        glow: "0 0 60px -10px rgba(255, 212, 40, 0.55)",
        "glow-soft": "0 0 40px -10px rgba(255, 212, 40, 0.35)",
        "inner-soft": "inset 0 1px 2px rgba(255,255,255,0.08)",
        card: "0 8px 30px rgba(0, 0, 0, 0.12)",
        "card-dark": "0 10px 40px rgba(0, 0, 0, 0.4)",
      },
      backgroundImage: {
        "grid-light":
          "linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)",
        "grid-dark":
          "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
        "radial-fade":
          "radial-gradient(circle at 50% 30%, rgba(255, 212, 40, 0.18), transparent 60%)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2.4s ease-in-out infinite",
        "spin-slow": "spin 12s linear infinite",
        shimmer: "shimmer 3s linear infinite",
        "fade-in-up": "fadeInUp 0.5s ease-out both",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseGlow: {
          "0%,100%": { boxShadow: "0 0 0 0 rgba(255, 212, 40, 0.45)" },
          "50%": { boxShadow: "0 0 0 16px rgba(255, 212, 40, 0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
