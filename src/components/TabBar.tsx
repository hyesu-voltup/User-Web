import { NavLink } from 'react-router-dom'
import { Home, Wallet, Gift, ListOrdered } from 'lucide-react'

const tabs = [
  { to: '/', label: '홈(룰렛)', icon: Home },
  { to: '/my', label: '내 포인트', icon: Wallet },
  { to: '/products', label: '상품 목록', icon: Gift },
  { to: '/orders', label: '주문 내역', icon: ListOrdered },
] as const

/**
 * 하단 탭바: 홈(룰렛), 내 포인트, 상품 목록, 주문 내역
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
                ? 'bg-brand-light text-content'
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
