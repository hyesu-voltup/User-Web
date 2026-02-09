import { Link } from 'react-router-dom'
import { CircleDot, Gift } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'
import { usePointsMe } from '../hooks/usePointsMe'
import { PointsSkeleton } from '../components/PointsSkeleton'

/**
 * 사용자 홈 화면
 * - 상단: 닉네임 + GET /api/v1/points/me 가용 잔액 강조, 7일 이내 만료 예정 소량 표시
 * - 중앙: 룰렛 돌리러 가기 / 인기 상품 보기 카드 배너
 */
export default function Home() {
  const { nickname } = useAuth()
  const { data: points, isPending, isError, error } = usePointsMe()

  const displayName = nickname?.trim() ? `${nickname}님` : '회원'
  const availablePoint = points?.availablePoint ?? 0
  const expiringPoint = points?.expiringPoint ?? 0

  return (
    <div className="py-6">
      {/* 상단: 인사 + 가용 잔액 */}
      <section className="rounded-2xl bg-brand-light p-5 mb-6">
        <p className="text-content-secondary text-sm mb-1">
          안녕하세요, <span className="font-medium text-content">{displayName}</span>
        </p>
        <p className="text-content-secondary text-xs mb-3">
          현재 가용 잔액
        </p>
        {isPending && (
          <PointsSkeleton />
        )}
        {isError && (
          <p className="text-content-secondary text-sm" role="alert">
            잔액을 불러오지 못했어요. ({error instanceof Error ? error.message : '오류'})
          </p>
        )}
        {!isPending && !isError && (
          <p className="text-3xl font-bold text-brand tabular-nums">
            {availablePoint.toLocaleString()}P
          </p>
        )}
        {/* 7일 이내 만료 예정: 작게 표시해 활동 유도 */}
        {!isPending && !isError && expiringPoint > 0 && (
          <p className="mt-2 text-xs text-content-secondary">
            7일 이내 만료 예정 <span className="font-medium text-amber-600">{expiringPoint.toLocaleString()}P</span>
            &nbsp;· 사용하시면 좋아요!
          </p>
        )}
        {!isPending && !isError && expiringPoint === 0 && (
          <p className="mt-2 text-xs text-content-muted">
            7일 이내 만료 예정 포인트 없음
          </p>
        )}
      </section>

      {/* 중앙: 바로가기 배너 카드 */}
      <section className="grid grid-cols-1 gap-4" aria-label="바로가기">
        <Link
          to="/roulette"
          className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-tabbar-border shadow-sm hover:border-brand/30 hover:shadow transition-all active:scale-[0.99]"
        >
          <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand-light text-brand">
            <CircleDot className="w-6 h-6" aria-hidden />
          </span>
          <div className="flex-1 text-left">
            <p className="font-semibold text-content">룰렛 돌리러 가기</p>
            <p className="text-xs text-content-secondary">당일 1회, 포인트를 받아보세요</p>
          </div>
        </Link>
        <Link
          to="/products"
          className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-tabbar-border shadow-sm hover:border-brand/30 hover:shadow transition-all active:scale-[0.99]"
        >
          <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand-light text-brand">
            <Gift className="w-6 h-6" aria-hidden />
          </span>
          <div className="flex-1 text-left">
            <p className="font-semibold text-content">인기 상품 보기</p>
            <p className="text-xs text-content-secondary">기프트카드 등 포인트로 구매</p>
          </div>
        </Link>
      </section>
    </div>
  )
}
