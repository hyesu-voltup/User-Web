import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { fetchMyOrders, type OrderHistoryItem } from '../api/orders'

/**
 * 주문 내역 페이지 (탭)
 * GET /api/v1/orders/me/{userId}, status 없으면 "확인"
 */
export default function Orders() {
  const { userId } = useAuth()
  const [list, setList] = useState<OrderHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return
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
    <div className="py-6">
      <h1 className="text-xl font-bold text-content">주문 내역</h1>
      <p className="mt-2 text-content-secondary text-sm">
        내가 구매한 상품 목록이에요.
      </p>

      {loading && (
        <p className="mt-6 text-content-muted text-sm">불러오는 중...</p>
      )}
      {error && (
        <p className="mt-6 text-red-600 text-sm" role="alert">{error}</p>
      )}
      {!loading && !error && list.length === 0 && (
        <p className="mt-6 text-content-muted text-sm">주문 내역이 없습니다.</p>
      )}
      {!loading && !error && list.length > 0 && (
        <ul className="mt-6 space-y-4">
          {list.map((order) => (
            <li
              key={order.orderId}
              className="py-4 px-4 rounded-xl border border-tabbar-border bg-white"
            >
              <p className="font-medium text-content">{order.productName}</p>
              <p className="text-content-secondary text-sm mt-1">
                {order.quantity}개 · {order.usedPoint.toLocaleString()}P
              </p>
              <p className="text-content-muted text-xs mt-1">
                {formatDateTime(order.orderedAt)}
              </p>
              <p className="mt-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded bg-bg-subtle text-content-secondary text-xs">
                  {order.status}
                </span>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
