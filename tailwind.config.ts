import type { Config } from "tailwindcss";

const withMT = require("@material-tailwind/react/utils/withMT");

const config: Config = withMT({
  darkMode: "selector",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "cypress-green": "#567256",
        "cypress-green-light": "#6f936f",
      },
    },
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
});
export default config;
