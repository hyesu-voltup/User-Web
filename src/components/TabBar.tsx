import { NavLink } from 'react-router-dom'
import { Home, CircleDot, Gift, User } from 'lucide-react'

const tabs = [
  { to: '/', label: '홈', icon: Home },
  { to: '/roulette', label: '룰렛', icon: CircleDot },
  { to: '/products', label: '상품', icon: Gift },
  { to: '/my', label: '내 정보', icon: User },
] as const

/**
 * 하단 탭바 (내비게이션)
 * [홈, 룰렛, 상품, 내 정보] - lucide-react 아이콘 사용
 */
export function TabBar() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-tabbar-bg border-t border-tabbar-border flex items-center justify-around py-2"
      style={{ paddingBottom: 'calc(0.5rem + var(--safe-area-inset-bottom))' }}
    >
      {tabs.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 min-w-[64px] py-1 rounded-lg transition-colors ${
              isActive
                ? 'text-tabbar-active'
                : 'text-tabbar-inactive hover:text-content-secondary'
            }`
          }
        >
          <Icon className="w-6 h-6" aria-hidden />
          <span className="text-xs font-medium">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
