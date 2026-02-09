import { useQuery } from '@tanstack/react-query'
import { fetchProducts } from '../api/products'

export const PRODUCTS_QUERY_KEY = ['products'] as const

/**
 * GET /api/v1/products 상품 목록 조회
 */
export function useProducts() {
  return useQuery({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: fetchProducts,
    staleTime: 60 * 1000,
  })
}
