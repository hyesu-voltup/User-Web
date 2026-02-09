import { apiClient } from './client'

/**
 * GET /api/v1/products 응답 항목 (기프트카드 등)
 * snake_case 대응
 */
export type Product = {
  id: string
  name: string
  price: number
  stock: number
  imageUrl?: string
}

/** 백엔드 응답: id(숫자 가능), pointPrice 또는 price, stock */
type ProductRaw = Product | {
  id?: string | number
  name?: string
  price?: number
  pointPrice?: number
  point_price?: number
  stock?: number
  image_url?: string
}

function toProduct(raw: ProductRaw): Product | null {
  const id = raw?.id != null ? String(raw.id) : ''
  if (!id) return null
  const price = Number(
    (raw as ProductRaw).price ??
    (raw as ProductRaw).pointPrice ??
    (raw as ProductRaw).point_price
  )
  const stock = Number(raw?.stock)
  if (Number.isNaN(price)) return null
  return {
    id,
    name: String(raw?.name ?? ''),
    price: Number.isFinite(price) ? price : 0,
    stock: Number.isFinite(stock) ? stock : 0,
    imageUrl: raw?.imageUrl ?? (raw as ProductRaw).image_url,
  }
}

/**
 * 상품 목록 조회. 재고 0인 상품도 포함 (UI에서 품절 처리)
 * 응답이 undefined/형식 다를 수 있어 정규화 후 유효한 항목만 반환
 */
export async function fetchProducts(): Promise<Product[]> {
  const { data } = await apiClient.get<ProductRaw[] | unknown>('/v1/products')
  const list = Array.isArray(data) ? data : []
  return list.map(toProduct).filter((p): p is Product => p != null)
}
