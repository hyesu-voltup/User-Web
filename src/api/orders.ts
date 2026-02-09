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
 * GET /api/v1/orders/me/{userId} 응답 항목 - 내 주문 내역 (VoltUp API 명세: Camel Case)
 */
export type OrderHistoryItem = {
  orderId: number
  productName: string
  quantity: number
  usedPoint: number
  orderedAt: string
  status: string
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
 * 내 주문 내역 조회. 백엔드가 Camel Case로 응답한다고 가정
 */
export async function fetchMyOrders(userId: string): Promise<OrderHistoryItem[]> {
  const { data } = await apiClient.get<OrderHistoryItem[]>(`/v1/orders/me/${encodeURIComponent(userId)}`)
  return Array.isArray(data) ? data : []
}
