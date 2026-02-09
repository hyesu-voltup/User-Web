import { useState } from 'react'
import type { Product } from '../api/products'
import { useProducts } from '../hooks/useProducts'
import { ProductDetailModal } from '../components/ProductDetailModal'
import { ProductGridSkeleton } from '../components/ProductCardSkeleton'

/**
 * 상품 쇼핑 페이지
 * GET /api/v1/products 2열 그리드, 클릭 시 상세 모달에서 수량 선택 후 구매
 */
export default function Products() {
  const { data: products = [], isLoading, isError, error } = useProducts()
  const [selected, setSelected] = useState<Product | null>(null)

  return (
    <div className="py-6">
      <h1 className="text-xl font-bold text-content">상품</h1>
      <p className="mt-2 text-content-secondary text-sm">
        포인트로 기프트카드 등을 구매할 수 있어요.
      </p>

      {isLoading && (
        <div className="mt-6">
          <ProductGridSkeleton />
        </div>
      )}
      {isError && (
        <p className="mt-6 text-center text-red-600 text-sm" role="alert">
          {error instanceof Error ? error.message : '목록을 불러오지 못했어요.'}
        </p>
      )}

      {!isLoading && !isError && products.length === 0 && (
        <p className="mt-6 text-center text-content-muted text-sm">등록된 상품이 없습니다.</p>
      )}

      {!isLoading && !isError && products.length > 0 && (
        <ul className="mt-6 grid grid-cols-2 gap-3">
          {products.map((product) => (
            <li key={product.id}>
              <button
                type="button"
                onClick={() => setSelected(product)}
                className="w-full text-left rounded-xl border border-tabbar-border bg-white p-3 shadow-sm hover:border-brand/40 hover:shadow transition-all active:scale-[0.99] disabled:opacity-70"
                disabled={(product.stock ?? 0) <= 0}
              >
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt=""
                    className="w-full aspect-square object-cover rounded-lg bg-bg-subtle"
                  />
                ) : (
                  <div className="w-full aspect-square rounded-lg bg-bg-subtle flex items-center justify-center text-content-muted text-xs">
                    이미지 없음
                  </div>
                )}
                <p className="mt-2 font-medium text-content line-clamp-2">{product.name ?? ''}</p>
                <p className="mt-1 text-sm text-content-secondary">
                  {(product.price ?? 0).toLocaleString()}P
                </p>
                {(product.stock ?? 0) <= 0 && (
                  <p className="mt-1 text-xs text-red-600">품절</p>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      {selected && (
        <ProductDetailModal
          product={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
