/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
      },
      animation: {
        fadeOut: "fadeOut 1s ease-out 1s forwards",
      },
      fontFamily: {
        custom: ["Anton-Regular", "sans-serif"],
      },
    },
  },
  plugins: [require("daisyui"), require("flowbite/plugin")],
  daisyui: {
    themes: ["light", "dark", "cupcake"],
  },
};
