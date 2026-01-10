/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // palette imposée
        night: "#0F172A",   // bleu nuit
        beige: "#E6D8B5",   // beige
        white: "#FFFFFF",   // blanc
      },
    },
  },
  plugins: [],
};