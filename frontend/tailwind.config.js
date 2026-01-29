/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Star Wars themed colors
        'force-light': {
          100: '#E8F4FD',
          200: '#B8DFFA',
          300: '#87CAF7',
          400: '#57B5F4',
          500: '#26A0F1',
          600: '#0D8ADB',
          700: '#0A6BAA',
          800: '#074C79',
          900: '#042D48',
        },
        'force-dark': {
          100: '#F5E6E6',
          200: '#E6B8B8',
          300: '#D68A8A',
          400: '#C75C5C',
          500: '#B82E2E',
          600: '#8B2323',
          700: '#5E1818',
          800: '#310D0D',
          900: '#1A0505',
        },
        'sith-red': '#FF0000',
        'jedi-blue': '#00BFFF',
        'imperial': {
          DEFAULT: '#1a1a2e',
          light: '#16213e',
          dark: '#0f0f1a',
        },
        'tatooine': {
          sand: '#C2B280',
          sunset: '#FF7F50',
        },
      },
      fontFamily: {
        'star-wars': ['Orbitron', 'sans-serif'],
        'narrative': ['Crimson Text', 'Georgia', 'serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px currentColor' },
          '100%': { boxShadow: '0 0 20px currentColor, 0 0 30px currentColor' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'stars': "url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"%3E%3Ccircle cx=\"10\" cy=\"10\" r=\"0.5\" fill=\"white\"/%3E%3Ccircle cx=\"30\" cy=\"25\" r=\"0.3\" fill=\"white\"/%3E%3Ccircle cx=\"50\" cy=\"5\" r=\"0.4\" fill=\"white\"/%3E%3Ccircle cx=\"70\" cy=\"35\" r=\"0.5\" fill=\"white\"/%3E%3Ccircle cx=\"90\" cy=\"15\" r=\"0.3\" fill=\"white\"/%3E%3Ccircle cx=\"20\" cy=\"60\" r=\"0.4\" fill=\"white\"/%3E%3Ccircle cx=\"40\" cy=\"80\" r=\"0.5\" fill=\"white\"/%3E%3Ccircle cx=\"60\" cy=\"55\" r=\"0.3\" fill=\"white\"/%3E%3Ccircle cx=\"80\" cy=\"75\" r=\"0.4\" fill=\"white\"/%3E%3Ccircle cx=\"5\" cy=\"90\" r=\"0.5\" fill=\"white\"/%3E%3Ccircle cx=\"95\" cy=\"95\" r=\"0.3\" fill=\"white\"/%3E%3C/svg%3E')",
      },
    },
  },
  plugins: [],
}
