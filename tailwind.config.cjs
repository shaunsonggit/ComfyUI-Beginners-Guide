/** @type {import("tailwindcss").Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}", "./public/**/*.html"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["'Inter Variable'", "Inter", "system-ui", "sans-serif"],
        body: ["'Inter Variable'", "Inter", "system-ui", "sans-serif"]
      },
      colors: {
        primary: {
          light: "#2563eb",
          DEFAULT: "#1d4ed8",
          dark: "#1e3a8a"
        },
        surface: {
          light: "#ffffff",
          dark: "#0f172a"
        },
        muted: {
          light: "#f8fafc",
          dark: "#1e293b"
        }
      },
      boxShadow: {
        highlight: "0 0 0 4px rgba(37, 99, 235, 0.45)"
      }
    }
  },
  plugins: [require("@tailwindcss/typography")]
};