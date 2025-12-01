/** @type {import('tailwindcss').Config} */
import scrollbarHide from "tailwind-scrollbar-hide";

export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        dark: {
          bg: "#0a0a0a",
          card: "#121212",
          hover: "#1e1e1e",
          border: "#2a2a2a",
        },
        light: {
          bg: "#f5f5f5",
          card: "#eaeaea",
          hover: "#dedede",
          border: "#cfcfcf",
        },
      },
    },
  },
  plugins: [scrollbarHide],
};
