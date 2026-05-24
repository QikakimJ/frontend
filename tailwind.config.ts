import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        jne: {
          red: "#E70012",
          navy: "#0F2053",
          gold: "#FFC72C",
          surface: "#F7F9FC",
        },
      },
      boxShadow: {
        jne: "0 30px 60px rgba(15, 32, 83, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;