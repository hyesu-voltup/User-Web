import { useAuth } from '../auth/AuthContext'

/**
 * 내 정보 페이지
 * 추후 포인트 상세 내역, 주문 내역 등
 */
export default function MyInfo() {
  const { userId, logout } = useAuth()

  return (
    <div className="py-6">
      <h1 className="text-xl font-bold text-content">내 정보</h1>
      <p className="mt-2 text-content-secondary text-sm">
        사용자 ID: {userId ?? '-'}
      </p>
      <button
        type="button"
        onClick={logout}
        className="mt-4 px-4 py-2 rounded-lg border border-tabbar-border text-content-secondary hover:bg-bg-subtle"
      >
        로그아웃
      </button>
    </div>
  )
}
