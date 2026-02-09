/**
 * 홈 포인트 영역 스켈레톤 (잔액 숫자 부분만)
 * GET /api/v1/points/me 로딩 중 section 안에 넣어 표시
 */
export function PointsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-9 bg-bg-subtle/80 rounded w-28" aria-busy="true" />
    </div>
  )
}
