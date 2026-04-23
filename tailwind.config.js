/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "Helvetica Neue", "sans-serif"],
      },
      colors: {
        // Primary greens
        primary: {
          DEFAULT: "#485C11",
          dark: "#3a4c0d",
        },
        // Olive greens (org dashboard / create opportunity)
        olive: {
          DEFAULT: "#3b4a2e",
          dark: "#2e3a1f",
          medium: "#6b7a52",
          light: "#4f5c3a",
        },
        // Accent greens (signup/login)
        accent: {
          DEFAULT: "#2d6a4f",
          dark: "#1b4332",
          bright: "#1c832f",
          light: "#d8f3dc",
        },
        // Skill / tag badges
        badge: {
          DEFAULT: "#8E9B77",
        },
        // Grays
        surface: {
          DEFAULT: "#D9D9D9",
          dark: "#c2c2c2",
          darker: "#c6c6c6",
          shadow: "#d0d0d0",
          focus: "#e2e2e2",
        },
        // Page backgrounds
        page: {
          DEFAULT: "#ebebeb",
          alt: "#f0f0f0",
        },
      },
      maxWidth: {
        content: "1140px",
        card: "1060px",
        header: "1100px",
      },
      borderRadius: {
        card: "20px",
        inner: "14px",
      },
      height: {
        nav: "88px",
        "nav-sm": "76px",
      },
    },
  },
  plugins: [],
};
