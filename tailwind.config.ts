import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#0f0317',
        'primary-light': '#271c2e',
        'primary-light-2': '#6a5677',
        'primary-transparent': '#271c2ee6',
        'secondary': '#d2583a',
        'secondary-light': '#db7961',
        'secondary-dark': '#bd4f33',
        'secondary-dark-2': '#a8462e',
        'secondary-dark-3': '#933e28',
        'secondary-dark-4': '#7e3522',
        'secondary-dark-5': '#692c1d',
        'tertiary': '#b88b86',

      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
