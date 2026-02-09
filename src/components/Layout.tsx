import { Outlet } from 'react-router-dom'
import { TabBar } from './TabBar'

/**
 * 메인 레이아웃: 상단 여백 + 콘텐츠 + 하단 탭바
 * 모바일 웹 환경에 맞춰 safe-area 및 탭바 높이만큼 padding-bottom 적용
 */
export function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <main
        className="flex-1 w-full max-w-lg mx-auto px-4 pb-24 overflow-auto"
        style={{
          paddingBottom: 'calc(6rem + var(--safe-area-inset-bottom))',
        }}
      >
        <Outlet />
      </main>
      <TabBar />
    </div>
  )
}
