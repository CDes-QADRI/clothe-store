import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        accent: {
          DEFAULT: 'var(--accent)',
          soft: 'var(--accent-soft)'
        },
        brand: {
          DEFAULT: '#0f172a',
          subtle: '#111827'
        }
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.375rem'
      },
      boxShadow: {
        soft: '0 18px 60px rgba(15,23,42,0.12)'
      }
    }
  },
  plugins: []
};

export default config;
