/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      /* ── Custom max-width breakpoints (mobile-down) ── */
      "max-1000": { max: "999px" },   // below 1000px  — tablet & mobile
      "max-500":  { max: "500px" },   // below 500px   — small phones (iPhone SE, etc.)

      /* ── Default Tailwind min-width breakpoints (kept intact) ── */
      sm:  "640px",
      md:  "768px",
      lg:  "1024px",
      xl:  "1280px",
      "2xl": "1536px",
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        bg: "var(--color-bg)",
        "bg-secondary": "var(--color-bg-secondary)",
        surface: "var(--color-surface)",
        primary: "var(--color-primary)",
        "primary-hover": "var(--color-primary-hover)",
      },
    },
  },
  plugins: [],
};
