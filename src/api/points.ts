import { apiClient } from './client'

/**
 * GET /api/v1/points/me 응답 (VoltUp API 명세: Camel Case)
 * - 현재 가용 잔액(availableBalance), 7일 이내 만료 예정(expiringWithin7Days)
 */
export type PointsMeResponse = {
  availableBalance: number
  expiringWithin7Days: number
}

/**
 * 포인트 요약 조회 (메인 화면 상단 노출용)
 * X-User-Id 헤더는 apiClient에서 자동 부착
 * @returns Promise<PointsMeResponse>
 */
export async function fetchPointsMe(): Promise<PointsMeResponse> {
  const { data } = await apiClient.get<PointsMeResponse>('/v1/points/me')
  return data ?? { availableBalance: 0, expiringWithin7Days: 0 }
}

/**
 * GET /api/v1/points/me/{userId} 응답 - 포인트 상세 (총 잔액 + 히스토리)
 * 명세: totalBalance, histories[].description, amount, expiryDate
 */
export type PointHistoryItem = {
  description: string
  amount: number
  expiryDate: string
}

export type PointsDetailResponse = {
  totalBalance: number
  histories: PointHistoryItem[]
}

/**
 * 내 포인트 상세 조회 (총 잔액 + 적립/사용 히스토리)
 */
export async function fetchPointsDetail(userId: string): Promise<PointsDetailResponse> {
  const { data } = await apiClient.get<PointsDetailResponse>(`/v1/points/me/${encodeURIComponent(userId)}`)
  return data ?? { totalBalance: 0, histories: [] }
}
