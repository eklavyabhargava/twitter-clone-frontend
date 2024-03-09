/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "btn-bg": "#439bf7",
        "btn-hover": "#2783e3",
        btnText: "#ffffff",
        "secBtn-bg": "#818d94",
        "secBtn-hover": "#5c686e",
      },
    },
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
};
