/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0C1B33', // Deep navy
          light: '#1a2b4d',
          dark: '#081220',
        },
        accent: {
          DEFAULT: '#FFB300', // Amber
          light: '#ffc233',
          dark: '#e6a100',
        },
        neutral: {
          DEFAULT: '#F4F5F7', // Soft gray
          light: '#ffffff',
          dark: '#E1E5EA',
        },
        success: '#38A169',
        error: '#E53E3E',
        warning: '#D69E2E',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
} 