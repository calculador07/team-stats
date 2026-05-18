/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Bebas Neue', 'Impact', 'sans-serif'],
        body: ['Rajdhani', 'sans-serif'],
        mono: ['Share Tech Mono', 'monospace'],
      },
      colors: {
        gold: {
          300: '#FFE082',
          400: '#FFD54F',
          500: '#FFC107',
          600: '#FFB300',
        },
        pitch: {
          900: '#0a0f1a',
          800: '#0d1424',
          700: '#111827',
          600: '#1a2332',
          500: '#243044',
        },
        neon: {
          green: '#00FF87',
          blue: '#00D4FF',
          purple: '#BF5FFF',
          red: '#FF4757',
        }
      },
      backgroundImage: {
        'pitch-gradient': 'radial-gradient(ellipse at top, #1a2332 0%, #0a0f1a 70%)',
        'gold-gradient': 'linear-gradient(135deg, #FFB300 0%, #FFE082 50%, #FFB300 100%)',
        'card-gradient': 'linear-gradient(145deg, rgba(255,193,7,0.15) 0%, rgba(10,15,26,0.9) 60%)',
        'silver-gradient': 'linear-gradient(135deg, #B0BEC5 0%, #ECEFF1 50%, #B0BEC5 100%)',
      },
      boxShadow: {
        'gold': '0 0 20px rgba(255,193,7,0.4), 0 0 60px rgba(255,193,7,0.1)',
        'neon-green': '0 0 20px rgba(0,255,135,0.4)',
        'neon-blue': '0 0 20px rgba(0,212,255,0.4)',
        'card': '0 8px 32px rgba(0,0,0,0.6)',
        'glow': '0 0 40px rgba(255,193,7,0.2)',
      },
      animation: {
        'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'fade-in': 'fade-in 0.4s ease-out',
        'count-up': 'count-up 1s ease-out',
      },
      keyframes: {
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255,193,7,0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(255,193,7,0.8), 0 0 80px rgba(255,193,7,0.3)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
