import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { fetchPointsDetail, type PointsDetailResponse } from '../api/points'

/**
 * 내 포인트 페이지 (탭)
 * 상단: 로그아웃 → 닉네임 환영 → 포인트 상세(총 잔액 + 히스토리 리스트) 바로 표시
 */
export default function MyInfo() {
  const { userId, nickname, logout } = useAuth()
  const [data, setData] = useState<PointsDetailResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchPointsDetail(userId)
      .then((res) => { if (!cancelled) setData(res) })
      .catch((e) => { if (!cancelled) setError(e instanceof Error ? e.message : '조회에 실패했습니다.') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [userId])

  const displayName = nickname?.trim() ? nickname : '회원'

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
    <div className="py-6">
      {/* 상단: 로그아웃 */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={logout}
          className="text-sm text-content-secondary hover:text-content py-1 px-2 -mr-2"
        >
          로그아웃
        </button>
      </div>

      <h1 className="text-xl font-bold text-content mt-2">내 포인트</h1>
      <p className="mt-2 text-content-secondary">
        <span className="font-medium text-content">{displayName}</span>님 환영합니다.
      </p>

      {/* 포인트 상세: 총 잔액 + 리스트 (버튼 없이 바로 표시) */}
      <section className="mt-6 rounded-2xl bg-brand-light p-5">
        <p className="text-content-secondary text-sm">총 잔액</p>
        {loading && (
          <p className="text-content-muted text-sm mt-1">불러오는 중...</p>
        )}
        {error && (
          <p className="text-red-600 text-sm mt-1" role="alert">{error}</p>
        )}
        {!loading && !error && data && (
          <p className="text-2xl font-bold text-content tabular-nums mt-1">
            {data.totalBalance.toLocaleString()}P
          </p>
        )}
      </section>

      <section className="mt-4">
        <h2 className="text-sm font-medium text-content-secondary">적립/사용 내역</h2>
        {loading && (
          <p className="text-content-muted text-sm py-4">불러오는 중...</p>
        )}
        {error && (
          <p className="text-red-600 text-sm py-4" role="alert">{error}</p>
        )}
        {!loading && !error && data && (
          <>
            {data.histories.length === 0 ? (
              <p className="mt-2 text-content-muted text-sm py-4">내역이 없습니다.</p>
            ) : (
              <ul className="mt-2 space-y-0 divide-y divide-tabbar-border rounded-xl border border-tabbar-border bg-white overflow-hidden">
                {data.histories.map((item, i) => (
                  <li key={i} className="py-3 px-4">
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
      </section>
    </div>
  )
}
