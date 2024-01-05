import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        main: {
          blue: "#06b6d4",
        },
      },
      typography: {
        DEFAULT: {
          css: {
            fontSize: "1rem",
            lineHeight: "1.75rem",
            strong: {
              color: "inherit",
              fontWeight: "600",
            },
            h2: {
              color: "inherit",
              fontWeight: "700",
              marginTop: 0,
              marginBottom: 0,
            },
            ul: {
              marginTop: "0.5rem",
              marginBottom: "0.5rem",
            },
            "ul li": {
              marginTop: 0,
              marginBottom: 0,
            },
            "ul li p": {
              marginTop: 0,
              marginBottom: 0,
            },
            ol: {
              marginTop: "0.5rem",
              marginBottom: "0.5rem",
            },
            "ol li": {
              marginTop: 0,
              marginBottom: 0,
            },
            "ol li p": {
              marginTop: 0,
              marginBottom: 0,
            },
            p: {
              marginTop: 0,
              marginBottom: 0,
            },
          },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/forms"),
  ],
} satisfies Config;
