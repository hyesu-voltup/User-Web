import { apiClient } from './client'

/**
 * GET /api/v1/points/me 응답 타입
 * - 현재 가용 잔액과 7일 이내 만료 예정 포인트
 */
export type PointsMeResponse = {
  /** 현재 가용 잔액 (사용 가능한 포인트) */
  availablePoint: number
  /** 7일 이내 만료 예정 포인트 */
  expiringPoint: number
}

/** 백엔드가 snake_case로 올 수 있으므로 통일해서 반환 */
type PointsMeRaw = PointsMeResponse | {
  available_point?: number
  expiring_point?: number
}

function normalizePointsMe(raw: PointsMeRaw): PointsMeResponse {
  return {
    availablePoint: raw.availablePoint ?? raw.available_point ?? 0,
    expiringPoint: raw.expiringPoint ?? raw.expiring_point ?? 0,
  }
}

/**
 * 포인트 요약 조회 (메인 화면 상단 노출용)
 * X-User-Id 헤더는 apiClient에서 자동 부착
 * @returns Promise<PointsMeResponse>
 */
export async function fetchPointsMe(): Promise<PointsMeResponse> {
  const { data } = await apiClient.get<PointsMeRaw>('/v1/points/me')
  return normalizePointsMe(data)
}

/**
 * GET /api/v1/points/me/{userId} 응답 - 포인트 상세(총 잔액 + 히스토리)
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

type PointHistoryItemRaw = PointHistoryItem | {
  description?: string
  amount?: number
  expiry_date?: string
}

type PointsDetailRaw = PointsDetailResponse | {
  total_balance?: number
  histories?: PointHistoryItemRaw[]
}

function toPointHistoryItem(raw: PointHistoryItemRaw): PointHistoryItem {
  return {
    description: String(raw?.description ?? ''),
    amount: Number(raw?.amount ?? 0),
    expiryDate: String((raw as PointHistoryItemRaw).expiryDate ?? (raw as PointHistoryItemRaw).expiry_date ?? ''),
  }
}

/**
 * 내 포인트 상세 조회 (총 잔액 + 적립/사용 히스토리)
 */
export async function fetchPointsDetail(userId: string): Promise<PointsDetailResponse> {
  const { data } = await apiClient.get<PointsDetailRaw>(`/v1/points/me/${encodeURIComponent(userId)}`)
  const totalBalance = Number((data as PointsDetailRaw).totalBalance ?? (data as PointsDetailRaw).total_balance ?? 0)
  const rawList = (data as PointsDetailRaw).histories
  const histories = Array.isArray(rawList) ? rawList.map(toPointHistoryItem) : []
  return { totalBalance, histories }
}
