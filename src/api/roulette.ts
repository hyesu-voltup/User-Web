import { apiClient } from './client'

/**
 * GET /api/v1/roulette/status 응답 (백엔드 지원 시)
 * 진입 시 오늘 참여 여부 확인용. 404면 미지원으로 간주하고 참여 가능 처리
 */
export type RouletteStatusResponse = {
  participatedToday: boolean
}

/**
 * POST /api/v1/roulette/participate 응답
 */
export type RouletteParticipateResponse = {
  grantedPoint: number
}

/**
 * 오늘 룰렛 참여 여부 조회 (진입 시 확인)
 * 백엔드 미지원(404 등) 시 { participatedToday: false } 반환 → 참여 가능 처리
 */
export async function getRouletteStatus(): Promise<RouletteStatusResponse> {
  try {
    const { data } = await apiClient.get<RouletteStatusResponse>('/v1/roulette/status')
    return data ?? { participatedToday: false }
  } catch {
    return { participatedToday: false }
  }
}

/** 응답이 snake_case일 수 있음 */
type RouletteParticipateRaw = RouletteParticipateResponse | { granted_point?: number }

/**
 * 룰렛 참여 (당일 1인 1회). 서버 락으로 응답이 지연될 수 있음
 * @returns Promise<RouletteParticipateResponse> - grantedPoint로 결과 표시
 */
export async function postRouletteParticipate(): Promise<RouletteParticipateResponse> {
  const { data } = await apiClient.post<RouletteParticipateRaw>('/v1/roulette/participate')
  const point = data?.grantedPoint ?? (data as RouletteParticipateRaw)?.granted_point ?? 0
  return { grantedPoint: point }
}
