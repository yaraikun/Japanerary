import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#16a085',
        dark: '#1f2d3d',
        'dark-nav': '#2c3e50',
        bg: '#f4f6f8',
        'bg-dark': '#0f172a',
        text: '#2c3e50',
        'text-dark': '#f1f5f9',
        subtext: '#5f6c7b',
        'subtext-dark': '#94a3b8',
      },
    },
  },
  plugins: [
    typography,
  ],
} satisfies Config;
