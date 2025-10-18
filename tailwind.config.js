const { fontFamily } = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./layouts/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        as: {
          background: "var(--color-background-main)",
          card: "var(--color-background-card)",
          surface: "var(--color-surface)",
          border: "var(--color-border)",
          borderStrong: "var(--color-border-strong)",
          heading: "var(--color-text-heading)",
          body: "var(--color-text-body)",
          muted: "var(--color-text-muted)",
          primary: "var(--color-primary)",
          primaryHover: "var(--color-primary-hover)",
          primaryActive: "var(--color-primary-active)",
          primaryContrast: "var(--color-primary-contrast)",
          highlight: "var(--color-highlight)",
          accentSoft: "var(--color-accent-soft)",
          focus: "var(--color-focus)",
          shadow: "var(--color-shadow)",
        },
      },
      boxShadow: {
        pixel: "0 24px 60px rgba(47, 97, 255, 0.18)",
        "pixel-sm": "0 12px 30px rgba(47, 97, 255, 0.12)",
      },
      borderRadius: {
        pixel: "14px",
      },
      transitionDuration: {
        120: "120ms",
      },
      fontFamily: {
        display: ['"Playfair Display"', ...fontFamily.serif],
        body: ['"Inter"', ...fontFamily.sans],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
      },
    },
  },
  plugins: [],
}

