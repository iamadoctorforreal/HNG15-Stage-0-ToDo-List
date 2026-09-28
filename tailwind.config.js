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
        floral: {
          cream: '#FAF6F0',
          beige: '#F4ECE1',
          rose: '#E8A0BF',
          'rose-dark': '#C97A9B',
          lavender: '#B4A7D6',
          'lavender-dark': '#8E7CC3',
          daffodil: '#F6D55C',
          sage: '#A8C5A0',
          stem: '#6C8062',
          charcoal: '#2D283E',
          plum: '#1E1428',
          'plum-card': '#2A1E38',
          'plum-border': '#3D2D50',
          blush: '#FFF2F5',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif', 'Georgia'],
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      animation: {
        'float-slow': 'float 18s ease-in-out infinite',
        'float-medium': 'float 13s ease-in-out infinite',
        'float-gentle': 'floatGentle 9s ease-in-out infinite',
        'sway': 'sway 8s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 4s ease-in-out infinite',
        'ripple': 'rippleEffect 0.8s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-22px) rotate(4deg)' },
        },
        floatGentle: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-12px) translateX(8px) rotate(-3deg)' },
          '66%': { transform: 'translateY(-6px) translateX(-8px) rotate(3deg)' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(4deg)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.75' },
        },
        rippleEffect: {
          '0%': { transform: 'scale(0.8)', opacity: '0.8' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}
