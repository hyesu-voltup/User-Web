import { apiClient } from './client'

/**
 * POST /api/v1/orders 요청 body (Swagger: productId는 integer, quantity는 integer)
 */
export type CreateOrderRequest = {
  productId: number
  quantity: number
}

/**
 * POST /api/v1/orders 응답 (성공 시)
 */
export type CreateOrderResponse = {
  orderId?: string
}

/**
 * 상품 주문. 포인트 부족(C005), 재고 부족(C006) 시 에러
 * Swagger 기준: body { productId: number, quantity: number }, X-User-Id 헤더
 */
export async function postOrder(productId: string | number, quantity: number): Promise<CreateOrderResponse> {
  const body: CreateOrderRequest = {
    productId: Number(productId),
    quantity: Number(quantity) || 1,
  }
  const { data } = await apiClient.post<CreateOrderResponse>('/v1/orders', body)
  return data ?? {}
}

/**
 * GET /api/v1/orders/me/{userId} 응답 항목 - 내 주문 내역
 * status 없으면 기본 "확인" (어드민 거부 시 등)
 */
export type OrderHistoryItem = {
  orderId: number
  productName: string
  quantity: number
  usedPoint: number
  orderedAt: string
  status: string
}

type OrderHistoryItemRaw = OrderHistoryItem | {
  order_id?: number
  product_name?: string
  quantity?: number
  used_point?: number
  ordered_at?: string
  status?: string
}

function toOrderHistoryItem(raw: OrderHistoryItemRaw): OrderHistoryItem {
  const orderId = Number((raw as OrderHistoryItemRaw).orderId ?? (raw as OrderHistoryItemRaw).order_id ?? 0)
  const productName = String((raw as OrderHistoryItemRaw).productName ?? (raw as OrderHistoryItemRaw).product_name ?? '')
  const quantity = Number(raw?.quantity ?? 0)
  const usedPoint = Number((raw as OrderHistoryItemRaw).usedPoint ?? (raw as OrderHistoryItemRaw).used_point ?? 0)
  const orderedAt = String((raw as OrderHistoryItemRaw).orderedAt ?? (raw as OrderHistoryItemRaw).ordered_at ?? '')
  const status = String((raw as OrderHistoryItemRaw).status ?? '확인')
  return { orderId, productName, quantity, usedPoint, orderedAt, status }
}

/**
 * 내 주문 내역 조회
 */
export async function fetchMyOrders(userId: string): Promise<OrderHistoryItem[]> {
  const { data } = await apiClient.get<OrderHistoryItemRaw[]>(`/v1/orders/me/${encodeURIComponent(userId)}`)
  const list = Array.isArray(data) ? data : []
  return list.map(toOrderHistoryItem)
}
