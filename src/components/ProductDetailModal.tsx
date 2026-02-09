import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { Product } from '../api/products'
import { postOrder } from '../api/orders'
import { getOrderErrorMessage } from '../lib/orderErrors'
import { useToast } from '../contexts/ToastContext'
import { POINTS_ME_QUERY_KEY } from '../hooks/usePointsMe'
import { PRODUCTS_QUERY_KEY } from '../hooks/useProducts'

type Props = {
  product: Product
  onClose: () => void
}

/**
 * 상품 상세 모달: 수량 선택 후 구매하기 → POST /api/v1/orders
 * 모바일 대응: 콘텐츠 스크롤, 구매하기 버튼은 항상 하단 고정
 */
export function ProductDetailModal({ product, onClose }: Props) {
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  const pointPrice = product.pointPrice ?? 0
  const stock = product.stock ?? 0
  const maxQty = Math.max(1, stock)
  const totalPrice = pointPrice * quantity
  const isOutOfStock = stock <= 0

  const handlePurchase = async () => {
    if (isOutOfStock || loading || quantity < 1) return
    setLoading(true)
    try {
      await postOrder(product.id, quantity)
      queryClient.invalidateQueries({ queryKey: POINTS_ME_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY })
      showToast('구매가 완료되었습니다.')
      onClose()
    } catch (err) {
      showToast(getOrderErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-end sm:justify-center bg-black/50"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-detail-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white shadow-xl flex flex-col max-h-[85vh] sm:max-h-[90vh] rounded-t-2xl sm:rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 스크롤 영역: 제목·이미지·수량 등 */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-5">
          <h2 id="product-detail-title" className="text-lg font-bold text-content">
            {product.name}
          </h2>
          {product.imageUrl && (
            <img
              src={product.imageUrl}
              alt=""
              className="mt-3 w-full aspect-video object-cover rounded-xl bg-bg-subtle"
            />
          )}
          <p className="mt-3 text-content-secondary text-sm">
            {pointPrice.toLocaleString()}P / 1개
          </p>
          <p className="mt-1 text-content-muted text-xs">
            재고 {stock}개
          </p>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-sm font-medium text-content">수량</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="w-9 h-9 rounded-lg border border-tabbar-border bg-white text-content disabled:opacity-50"
              >
                −
              </button>
              <span className="w-8 text-center text-content font-medium tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                disabled={quantity >= maxQty}
                className="w-9 h-9 rounded-lg border border-tabbar-border bg-white text-content disabled:opacity-50"
              >
                +
              </button>
            </div>
          </div>

          <p className="mt-3 text-content font-semibold">
            합계 {totalPrice.toLocaleString()}P
          </p>
        </div>

        {/* 구매하기: 항상 하단 고정, 모바일에서도 항상 보이도록 flex-shrink-0 */}
        <div
          className="flex-shrink-0 p-4 pt-2 border-t border-tabbar-border bg-white"
          style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
        >
          <button
            type="button"
            onClick={handlePurchase}
            disabled={isOutOfStock || loading}
            className="w-full py-3 rounded-xl bg-brand text-content font-medium hover:bg-brand-hover disabled:opacity-50 disabled:pointer-events-none"
          >
            {isOutOfStock ? '품절' : loading ? '구매 중입니다.' : '구매하기'}
          </button>
        </div>
      </div>
    </div>
  )
}
