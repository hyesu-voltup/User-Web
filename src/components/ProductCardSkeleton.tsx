/**
 * 상품 카드 스켈레톤 (2열 그리드용)
 * API 로딩 중 화면이 멈춘 것처럼 보이지 않도록 표시
 */
export function ProductCardSkeleton() {
  return (
    <div className="rounded-xl border border-tabbar-border bg-white p-3 animate-pulse">
      <div className="w-full aspect-square rounded-lg bg-bg-subtle" />
      <div className="mt-2 h-4 bg-bg-subtle rounded w-3/4" />
      <div className="mt-2 h-3 bg-bg-subtle rounded w-1/3" />
    </div>
  )
}

/**
 * 상품 목록 2열 그리드 스켈레톤 (6칸)
 */
export function ProductGridSkeleton() {
  return (
    <ul className="grid grid-cols-2 gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <li key={i}>
          <ProductCardSkeleton />
        </li>
      ))}
    </ul>
  )
}
