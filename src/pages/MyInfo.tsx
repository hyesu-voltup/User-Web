import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { PointDetailModal } from '../components/PointDetailModal'
import { OrderHistoryModal } from '../components/OrderHistoryModal'

/**
 * 내 정보 페이지
 * 상단: 닉네임 + 님 환영합니다
 * 내 포인트 상세 조회 버튼 → GET /api/v1/points/me/{userId} 모달
 * 내 주문 내역 보기 버튼 → GET /api/v1/orders/me/{userId} 모달 (status 없으면 "확인")
 */
export default function MyInfo() {
  const { userId, nickname, logout } = useAuth()
  const [showPointDetail, setShowPointDetail] = useState(false)
  const [showOrderHistory, setShowOrderHistory] = useState(false)

  const displayName = nickname?.trim() ? nickname : '회원'

  return (
    <div className="py-6">
      <h1 className="text-xl font-bold text-content">내 정보</h1>
      <p className="mt-2 text-content-secondary">
        <span className="font-medium text-content">{displayName}</span>님 환영합니다.
      </p>

      <div className="mt-6 space-y-3">
        <button
          type="button"
          onClick={() => setShowPointDetail(true)}
          className="w-full py-3 px-4 rounded-xl border border-tabbar-border bg-white text-content font-medium hover:bg-bg-subtle hover:border-brand/30 transition-colors text-left flex items-center justify-between"
        >
          <span>내 포인트 상세 조회</span>
          <span className="text-content-muted">→</span>
        </button>
        <button
          type="button"
          onClick={() => setShowOrderHistory(true)}
          className="w-full py-3 px-4 rounded-xl border border-tabbar-border bg-white text-content font-medium hover:bg-bg-subtle hover:border-brand/30 transition-colors text-left flex items-center justify-between"
        >
          <span>내 주문 내역 보기</span>
          <span className="text-content-muted">→</span>
        </button>
      </div>

      <button
        type="button"
        onClick={logout}
        className="mt-8 w-full py-3 rounded-xl border border-tabbar-border text-content-secondary hover:bg-bg-subtle"
      >
        로그아웃
      </button>

      {userId && showPointDetail && (
        <PointDetailModal
          userId={userId}
          onClose={() => setShowPointDetail(false)}
        />
      )}
      {userId && showOrderHistory && (
        <OrderHistoryModal
          userId={userId}
          onClose={() => setShowOrderHistory(false)}
        />
      )}
    </div>
  )
}
