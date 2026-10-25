/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fdfbf3',
          100: '#faf3e0',
          200: '#f0e3b8',
          300: '#e6d090',
          400: '#d4b85e',
          500: '#c4a14a',
          600: '#a8842f',
          700: '#856824',
          800: '#6b5220',
          900: '#5a441f',
        },
        cream: {
          50: '#1a1a1d',
          100: '#2b2b30',
          200: '#52525a',
          300: '#6f6f78',
          400: '#9d9da4',
          500: '#c5c5c9',
        },
        ink: {
          50: '#1c1c1e',
          100: '#2b2b2e',
          200: '#3f3f43',
          300: '#525258',
          400: '#6f6f76',
          500: '#9d9da4',
          600: '#d4d0c9',
          700: '#e5e1da',
          800: '#f2efe9',
          900: '#ffffff',
          950: '#faf7f2',
        },
        neutral: {
          400: '#8a857e',
          500: '#6b6660',
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
