/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#000000",
        secondary: "#e0e7ff",
        tertiary: "#111827",
        "black-100": "#100d25",
        "black-200": "#090325",
        "white-100": "#f3f3f3",
      },
      fontFamily: {  
        orbitron: ['Orbitron', 'sans-serif'], 
        jetbrains: ['JetBrains Mono', 'monospace'],  
        space:['Space Mono', 'monospace'],
        tech:['Bitcount Grid Double', 'monospace'],
      },
      boxShadow: {
        card: "0px 35px 120px -15px #000000",
      },
      screens: {
        xs: "450px",
      },
    },
  },
  plugins: [],
};
  