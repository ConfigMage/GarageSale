import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        broadcast: {
          ink: "#16110f",
          red: "#d71920",
          gold: "#ffc947",
          cream: "#fff7e1",
          teal: "#008b8b",
          blue: "#173f7a",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "Segoe UI",
          "Arial",
          "sans-serif",
        ],
        display: [
          "Georgia",
          "Cambria",
          "Times New Roman",
          "serif",
        ],
      },
      boxShadow: {
        promo: "0 16px 40px rgba(22, 17, 15, 0.18)",
      },
      animation: {
        ticker: "ticker 24s linear infinite",
        pulseLive: "pulseLive 1.4s ease-in-out infinite",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(calc(-1 * var(--ticker-width)))" },
        },
        pulseLive: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: ".45" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
