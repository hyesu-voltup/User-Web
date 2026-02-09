import { apiClient } from './client'

/**
 * GET /api/v1/products 응답 항목 (VoltUp API 명세: Camel Case)
 * point_price → pointPrice
 */
export type Product = {
  id: string
  name: string
  pointPrice: number
  stock: number
  imageUrl?: string
}

/**
 * 상품 목록 조회. 재고 0인 상품도 포함 (UI에서 품절 처리)
 */
export async function fetchProducts(): Promise<Product[]> {
  const { data } = await apiClient.get<Product[]>('/v1/products')
  return Array.isArray(data) ? data : []
}
