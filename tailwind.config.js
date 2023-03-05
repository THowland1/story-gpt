const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      primary: ["var(--lora-font)", ...fontFamily.sans],
      serif: ["var(--lora-font)", ...fontFamily.serif],
    },
    extend: {
      keyframes: {
        flip: {
          "0%": { transform: "skewY(0) rotateY(0)" },
          "50%": { transform: "skewY(-3deg) rotateY(90deg)" },
          "51%": { transform: "skewY(3deg) rotateY(90deg)" },
          "100%": {
            transform: "skewY(0) rotateY(180deg)",
          },
        },
        "appear-midway": {
          "0%": { opacity: 0 },
          "50%": { opacity: 0 },
          "51%": { opacity: 0.8 },
          "100%": { opacity: 0.8 },
        },
        animation: {
          flip: "flip 1s ease-in-out infinite",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@headlessui/tailwindcss")],
};
