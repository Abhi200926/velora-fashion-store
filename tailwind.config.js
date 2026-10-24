/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fbf6e9',
          100: '#f5e9c8',
          200: '#ecd79a',
          300: '#e0c068',
          400: '#d4a843',
          500: '#c89b2f',
          600: '#a87d24',
          700: '#856121',
          800: '#6b4d20',
          900: '#5a401f',
        },
        cream: {
          50: '#fefcf8',
          100: '#fdf8ef',
          200: '#faf0dd',
          300: '#f5e3c4',
          400: '#ecd0a3',
          500: '#dab880',
        },
        ink: {
          50: '#f6f6f7',
          100: '#e2e2e4',
          200: '#c5c5c9',
          300: '#9d9da4',
          400: '#6f6f78',
          500: '#52525a',
          600: '#3f3f46',
          700: '#2b2b30',
          800: '#1a1a1d',
          900: '#0c0c0e',
          950: '#060607',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
};
