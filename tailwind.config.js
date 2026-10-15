/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Sansiri Official Color System
        sansiri: {
          blue: '#0053b5',      // Sansiri Royal Blue (Primary)
          deep: '#003168',      // Sansiri Deep Navy
          dark: '#001e42',      // Sansiri Midnight Dark
          light: '#d9e5f4',     // Sansiri Sky Ice Blue
          ice: '#f3f6fe',       // Sansiri Crisp Surface
          bg: '#f8fafc',        // Sansiri Clean Neutral Background
          orange: '#f94700',    // Sansiri Hot Deal / Highlight Orange
          green: '#00654d',     // Sansiri Nature Green
          text: '#101828',      // Sansiri Dark Headline
          muted: '#475467',     // Sansiri Secondary Text
          border: '#e2e8f0'     // Sansiri Subtle Divider
        },
        navy: {
          50: '#f0f5fc',
          100: '#d9e5f4',
          200: '#bfd4ec',
          300: '#8cb7e4',
          400: '#4b90db',
          500: '#1b71cc',
          600: '#0053b5', // Official Sansiri Blue
          700: '#00418f',
          800: '#003168', // Official Sansiri Deep Navy
          900: '#00224a',
          950: '#00142b',
        },
        gold: {
          50: '#f0f6fd',
          100: '#d9e5f4', // Sansiri light blue tag
          200: '#bfd4ec',
          300: '#8cb7e4',
          400: '#4b90db',
          500: '#0053b5', // Replaced with Sansiri Blue
          600: '#00418f',
          700: '#003168',
          800: '#00224a',
          900: '#00142b',
          950: '#000c1e',
        }
      },
      fontFamily: {
        sans: ['Prompt', 'system-ui', '-apple-system', 'sans-serif'],
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
      },
      animation: {
        marquee: 'marquee 35s linear infinite',
        'marquee-reverse': 'marquee-reverse 35s linear infinite',
      },
    },
  },
  plugins: [],
};
