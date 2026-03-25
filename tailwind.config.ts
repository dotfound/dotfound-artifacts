import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#002040',
          coral: '#FF6B6B',
          cyan: '#22D3EE',
          purple: '#a78bfa',
          'light-blue': '#cee4ff',
          'off-white': '#f2f2f2',
          grey: '#767676',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        sm: '6px',
        md: '8px',
        lg: '12px',
      },
    },
  },
  plugins: [],
}

export default config
