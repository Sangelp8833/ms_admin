import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background:       '#0F1117',
        surface:          '#161B22',
        border:           '#30363D',
        accent:           '#C4522A',
        'accent-dark':    '#8B3A1E',
        'accent-light':   '#E8855E',
        success:          '#3FB950',
        warning:          '#D29922',
        danger:           '#F85149',
        'text-primary':   '#E6EDF3',
        'text-secondary': '#7D8590',
        'hover-row':      '#1C2128',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      animation: {
        'fade-in':  'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
      },
      keyframes: {
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
