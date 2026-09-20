/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // DEEGOLD Corporate Identity (CLAUDE.md §2.1)
      colors: {
        ivory: {
          DEFAULT: "#FFF8F1",
          dim: "#FBF8F2",
        },
        burgundy: {
          DEFAULT: "#7A0F1A",
          deep: "#660C15",
        },
        "aus-red": {
          DEFAULT: "#B31D1D",
          bright: "#D32F2F",
        },
        gold: {
          DEFAULT: "#D4AF37",
          dark: "#C59B27",
        },
        "gold-border": {
          DEFAULT: "#E2CCA4",
          glow: "#D4AF3740",
        },
        // -> utilities: text-espresso, bg-espresso
        espresso: "#2D2421",
        // -> utilities: text-secondary, bg-secondary
        secondary: "#7A6F68",
        emerald: {
          DEFAULT: "#16A34A",
          light: "#22C55E",
        },
      },
      fontFamily: {
        sans: ["Sarabun", "Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "gold-card": "0 4px 20px rgba(212,175,55,0.08)",
        "gold-glow": "0 0 0 3px rgba(212,175,55,0.18)",
      },
    },
  },
  plugins: [],
};
