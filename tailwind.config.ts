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
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          green: "#8BC34A",
          black: "#000000",
          white: "#FFFFFF",
          accent: "#333333",
        },
      },
      fontFamily: {
        display: ["Inter", "Oswald", "Arial Black", "sans-serif"],
        graffiti: ["Impact", "Arial Black", "sans-serif"],
        body: ["Inter", "Arial", "sans-serif"],
      },
      boxShadow: {
        brutal: "4px 4px 0px 0px #000000",
        brutalMd: "6px 6px 0px 0px #000000",
        brutalLg: "8px 8px 0px 0px #000000",
      },
      borderWidth: {
        3: "3px",
        6: "6px",
        8: "8px",
      },
      rotate: {
        15: "15deg",
        30: "30deg",
      },
      screens: {
        xs: "475px",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        pop: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)" },
        },
        "skew-in": {
          "0%": { transform: "skewX(-10deg) translateX(-100%)" },
          "100%": { transform: "skewX(0deg) translateX(0%)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0px)" },
        },
      },
      animation: {
        wiggle: "wiggle 1s ease-in-out infinite",
        pop: "pop 0.3s ease-in-out",
        "skew-in": "skew-in 0.6s ease-out",
        "fade-up": "fade-up 0.6s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;