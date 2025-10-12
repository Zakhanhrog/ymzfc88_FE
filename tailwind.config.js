/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Tahoma', 'Arial', 'Helvetica Neue', 'sans-serif'],
      },
      letterSpacing: {
        'tighter': '-0.035em',
        'tight': '-0.025em',
        'normal': '0em',
      },
      colors: {
        primary: {
          50: '#F7F9FB',
          100: '#EEF2F6',
          200: '#D4E0EC',
          300: '#B9CDE2',
          400: '#B2C0D1',
          500: '#B2C0D1',
          600: '#9BABC2',
          700: '#8A9BB0',
          800: '#798B9F',
          900: '#687B8E',
        }
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'fadeIn': 'fadeIn 0.3s ease-in-out',
        'slideInLeft': 'slideInLeft 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInLeft: {
          '0%': { 
            opacity: '0',
            transform: 'translateX(-10px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateX(0)'
          },
        },
      }
    },
  },
  plugins: [],
}
