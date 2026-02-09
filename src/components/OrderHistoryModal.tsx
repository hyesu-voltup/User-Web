import { useEffect, useState } from 'react'
import { fetchMyOrders, type OrderHistoryItem } from '../api/orders'

type Props = {
  userId: string
  onClose: () => void
}

/**
 * 내 주문 내역 모달
 * GET /api/v1/orders/me/{userId} → 주문 목록 (status 없으면 "확인")
 */
export function OrderHistoryModal({ userId, onClose }: Props) {
  const [list, setList] = useState<OrderHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchMyOrders(userId)
      .then((res) => { if (!cancelled) setList(res) })
      .catch((e) => { if (!cancelled) setError(e instanceof Error ? e.message : '조회에 실패했습니다.') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [userId])

  const formatDateTime = (s: string) => {
    if (!s) return '-'
    try {
      const d = new Date(s)
      return Number.isNaN(d.getTime()) ? s : d.toLocaleString('ko-KR')
    } catch {
      return s
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-end sm:justify-center bg-black/50"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-history-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white shadow-xl flex flex-col max-h-[85vh] sm:max-h-[90vh] rounded-t-2xl sm:rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-shrink-0 p-4 border-b border-tabbar-border flex items-center justify-between">
          <h2 id="order-history-title" className="text-lg font-bold text-content">
            내 주문 내역
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 -m-2 rounded-lg text-content-muted hover:bg-bg-subtle"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4">
          {loading && (
            <p className="text-content-muted text-sm py-4">불러오는 중...</p>
          )}
          {error && (
            <p className="text-red-600 text-sm py-4" role="alert">{error}</p>
          )}
          {!loading && !error && list.length === 0 && (
            <p className="text-content-muted text-sm py-4">주문 내역이 없습니다.</p>
          )}
          {!loading && !error && list.length > 0 && (
            <ul className="space-y-4">
              {list.map((order) => (
                <li
                  key={order.orderId}
                  className="py-3 border-b border-tabbar-border last:border-0"
                >
                  <p className="font-medium text-content">{order.productName}</p>
                  <p className="text-content-secondary text-sm mt-1">
                    {order.quantity}개 · {order.usedPoint.toLocaleString()}P
                  </p>
                  <p className="text-content-muted text-xs mt-1">
                    {formatDateTime(order.orderedAt)}
                  </p>
                  <p className="mt-1 text-xs">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-bg-subtle text-content-secondary">
                      {order.status}
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div
          className="flex-shrink-0 p-4 border-t border-tabbar-border bg-white"
          style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
        >
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-brand text-content font-medium hover:bg-brand-hover"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}
