/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#F7F8FA',
        surface: '#FFFFFF',
        ink: {
          950: '#0E1014',
          900: '#14161A',
          700: '#363A44',
          600: '#565B66',
          400: '#9498A3',
          200: '#D6D9DF',
        },
        border: '#E6E8EC',
        moss: {
          100: '#E3F0EC',
          300: '#9BC9B8',
          500: '#2E8A6C',
          600: '#1B6F5C',
          700: '#155747',
        },
        ember: {
          100: '#FFE7E0',
          400: '#FF8A6B',
          500: '#FF6B4A',
          600: '#E2502F',
        },
        indigo: {
          100: '#E8EAFB',
          400: '#7C8AE8',
          500: '#4C5FD5',
          600: '#3B4BB8',
        },
        amber: {
          100: '#FBEDD7',
          400: '#F0BC72',
          500: '#E8A23D',
          600: '#C9852A',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        sm: '8px',
        DEFAULT: '10px',
        lg: '16px',
        xl: '20px',
      },
      boxShadow: {
        xs: '0 1px 2px rgba(20,22,26,0.04)',
        card: '0 1px 2px rgba(20,22,26,0.04), 0 1px 1px rgba(20,22,26,0.03)',
        raised: '0 8px 24px rgba(20,22,26,0.08), 0 2px 6px rgba(20,22,26,0.04)',
        floating: '0 16px 40px rgba(20,22,26,0.16), 0 4px 12px rgba(20,22,26,0.08)',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },
      keyframes: {
        'ring-fill': {
          from: { strokeDashoffset: 'var(--ring-from)' },
          to: { strokeDashoffset: 'var(--ring-to)' },
        },
        'fade-up': {
          from: { opacity: 0, transform: 'translateY(8px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease-out both',
      },
    },
  },
  plugins: [],
}
