/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FAF8F5',
          100: '#F4EFEA', // exact reference background
          200: '#E8DFD6',
          300: '#DDD2C5',
          400: '#C2B5A5',
        },
        forest: {
          800: '#1B3B36',
          900: '#142E2A',
          950: '#0F2320', // dark forest green for buttons/headings
        },
        sidebar: '#FFFFFF',
        darkBg: '#121615',
        darkCard: '#1A211E',
        darkBorder: '#27332F',
        darkText: '#ECE8E1',
        darkMuted: '#9CA7A2',
        accent: {
          orange: '#FF7A59',
          yellow: '#F8B84E',
          purple: '#C8A2C8',
        }
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'var(--font-hind-siliguri)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'var(--font-anek-bangla)', 'serif'],
        bangla: ['var(--font-hind-siliguri)', 'var(--font-anek-bangla)', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      }
    },
  },
  plugins: [],
};
