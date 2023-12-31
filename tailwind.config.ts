import type { Config } from "tailwindcss";
import colors from "./src/app/ui/colors";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: colors.primary_100,
          200: colors.primary_200,
          300: colors.primary_300,
        },
        accent: {
          100: colors.accent_100,
          200: colors.accent_200,
        },
        text: {
          100: colors.text_100,
          200: colors.text_200,
          300: colors.text_300,
        },
        bg: {
          100: colors.bg_100,
          200: colors.bg_200,
          300: colors.bg_300,
        },
        error: {
          100: colors.error_100,
        },
      },

      aspectRatio: {
        "3/1": "3 / 1",
      },
    },
  },
  plugins: [],
};
export default config;
