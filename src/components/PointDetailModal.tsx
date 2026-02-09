import { useEffect, useState } from 'react'
import { fetchPointsDetail, type PointsDetailResponse } from '../api/points'

type Props = {
  userId: string
  onClose: () => void
}

/**
 * 내 포인트 상세 조회 모달
 * GET /api/v1/points/me/{userId} → 총 잔액 + 히스토리 리스트
 */
export function PointDetailModal({ userId, onClose }: Props) {
  const [data, setData] = useState<PointsDetailResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchPointsDetail(userId)
      .then((res) => { if (!cancelled) setData(res) })
      .catch((e) => { if (!cancelled) setError(e instanceof Error ? e.message : '조회에 실패했습니다.') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [userId])

  const formatDate = (s: string) => {
    if (!s) return '-'
    try {
      const d = new Date(s)
      return Number.isNaN(d.getTime()) ? s : d.toLocaleDateString('ko-KR')
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
      aria-labelledby="point-detail-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white shadow-xl flex flex-col max-h-[85vh] sm:max-h-[90vh] rounded-t-2xl sm:rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-shrink-0 p-4 border-b border-tabbar-border flex items-center justify-between">
          <h2 id="point-detail-title" className="text-lg font-bold text-content">
            포인트 상세 내역
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
          {!loading && !error && data && (
            <>
              <p className="text-content-secondary text-sm">총 잔액</p>
              <p className="text-xl font-bold text-content tabular-nums mt-1">
                {data.totalBalance.toLocaleString()}P
              </p>
              <p className="mt-4 text-content-secondary text-sm">적립/사용 내역</p>
              {data.histories.length === 0 ? (
                <p className="mt-2 text-content-muted text-sm">내역이 없습니다.</p>
              ) : (
                <ul className="mt-2 space-y-3">
                  {data.histories.map((item, i) => (
                    <li
                      key={i}
                      className="py-3 border-b border-tabbar-border last:border-0"
                    >
                      <p className="text-content text-sm">{item.description || '-'}</p>
                      <p className="text-content-secondary text-xs mt-1">
                        {item.amount >= 0 ? '+' : ''}{item.amount.toLocaleString()}P
                        {item.expiryDate && ` · 만료 ${formatDate(item.expiryDate)}`}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </>
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
