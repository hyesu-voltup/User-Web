/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        /* LG 볼트업 브랜드: 깔끔한 화이트 + 포인트 컬러 (메인 #E4FF30) */
        brand: {
          DEFAULT: '#E4FF30',
          hover: '#c9e62a',
          light: '#f7ffe0',
        },
        bg: {
          DEFAULT: '#ffffff',
          subtle: '#f8f9fa',
          elevated: '#ffffff',
        },
        tabbar: {
          bg: '#ffffff',
          border: '#e5e7eb',
          active: '#E4FF30',
          inactive: '#9ca3af',
        },
        /* 텍스트 계열 (이름 충돌 방지로 content 사용) */
        content: {
          DEFAULT: '#1a1a1a',
          secondary: '#6b7280',
          muted: '#9ca3af',
        },
      },
      keyframes: {
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'spin-slow': 'spin-slow 1.2s linear infinite',
        'fade-in': 'fade-in 0.25s ease-out',
      },
    },
  },
  plugins: [],
}
