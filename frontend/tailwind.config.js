import rtl from 'tailwindcss-rtl';

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        red: { DEFAULT: '#C1272D', dark: '#8B1A1E' },
        green: { DEFAULT: '#006233', dark: '#004d26' },
        gold: { DEFAULT: '#C8A84B', light: '#F5DC80' },
        cream: '#FAF8F3',
        surf: '#F4F0E8',
        bord: '#E2D9C8',
        ink: '#1A1A2E',
        muted: '#6B7080',
      },
      fontFamily: {
        ar: ['Tajawal', 'Cairo', 'sans-serif'],
        latin: ['Inter', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
    },
  },
  plugins: [rtl],
};
