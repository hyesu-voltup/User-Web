/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        /* LG 볼트업 브랜드: 깔끔한 화이트 + 포인트 컬러 */
        brand: {
          DEFAULT: '#E3002C',
          hover: '#c40026',
          light: '#fff0f3',
        },
        bg: {
          DEFAULT: '#ffffff',
          subtle: '#f8f9fa',
          elevated: '#ffffff',
        },
        tabbar: {
          bg: '#ffffff',
          border: '#e5e7eb',
          active: '#E3002C',
          inactive: '#9ca3af',
        },
        /* 텍스트 계열 (이름 충돌 방지로 content 사용) */
        content: {
          DEFAULT: '#1a1a1a',
          secondary: '#6b7280',
          muted: '#9ca3af',
        },
      },
    },
  },
  plugins: [],
}
