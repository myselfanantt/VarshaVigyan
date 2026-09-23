/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sidebar: {
          bg: '#0F1729',
          text: '#A8B4CC',
          activeBg: '#1A2744',
          activeBorder: '#1A6FE8',
        },
        main: {
          bg: '#F0F4FA',
          card: '#FFFFFF',
        },
        primary: '#1A6FE8',
        'heavy-rain': '#E84E1A',
        'regime-normal': '#18A86B',
        warning: '#F59E0B',
        critical: '#DC2626',
        text: {
          primary: '#0D1B2A',
          secondary: '#4A5568',
        },
        regime: {
          active: '#18A86B',
          break: '#F59E0B',
          depression: '#E84E1A',
          coastal: '#1A6FE8',
          orographic: '#7C3AED',
          western: '#64748B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '8px',
        chip: '4px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.05)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.10)',
      },
    },
  },
  plugins: [],
}
