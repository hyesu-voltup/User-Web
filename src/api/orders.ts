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
 * GET /api/v1/orders/me/{userId} 응답 항목 - 내 주문 내역 (API 명세: Camel Case)
 * status 없으면 기본 "확인"
 */
export type OrderHistoryItem = {
  orderId: number
  productName: string
  quantity: number
  usedPoint: number
  orderedAt: string
  status: string
}

/** 백엔드 응답 (Camel 또는 Snake Case) → 매핑으로 OrderHistoryItem 통일 */
type OrderHistoryItemRaw = {
  orderId?: number
  order_id?: number
  productName?: string
  product_name?: string
  quantity?: number
  usedPoint?: number
  used_point?: number
  orderedAt?: string
  ordered_at?: string
  status?: string
}

function toOrderHistoryItem(raw: OrderHistoryItemRaw): OrderHistoryItem {
  return {
    orderId: Number(raw.orderId ?? raw.order_id ?? 0),
    productName: String(raw.productName ?? raw.product_name ?? ''),
    quantity: Number(raw.quantity ?? 0),
    usedPoint: Number(raw.usedPoint ?? raw.used_point ?? 0),
    orderedAt: String(raw.orderedAt ?? raw.ordered_at ?? ''),
    status: String(raw.status ?? '확인'),
  }
}

/**
 * 내 주문 내역 조회. 응답을 Camel Case OrderHistoryItem[] 로 반환
 */
export async function fetchMyOrders(userId: string): Promise<OrderHistoryItem[]> {
  const { data } = await apiClient.get<OrderHistoryItemRaw[]>(`/v1/orders/me/${encodeURIComponent(userId)}`)
  const list = Array.isArray(data) ? data : []
  return list.map(toOrderHistoryItem)
}
