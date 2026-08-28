/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: 'var(--bg-base)',
        surface: 'var(--bg-surface)',
        surfaceHover: 'var(--surface-hover)',
        border: 'var(--border)',
        borderStrong: 'var(--border-strong)',
        appText: 'var(--text)',
        appTextSecondary: 'var(--text-secondary)',
        appTextMuted: 'var(--text-muted)',
        errorText: 'var(--error-text)',
        successText: 'var(--success-text)',
        warningText: 'var(--warning-text)',
      },
    },
  },
  plugins: [],
};
