import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-instrument)'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      colors: {
        background: "#FFFFFF",
        foreground: "#000000",
      },
      animation: {
        "fade-rise": "fadeRise 0.8s ease-out forwards",
        "fade-rise-delay": "fadeRise 0.8s ease-out 0.2s forwards",
        "fade-rise-delay-2": "fadeRise 0.8s ease-out 0.4s forwards",
      },
      keyframes: {
        fadeRise: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
