import { useQuery } from '@tanstack/react-query'
import { fetchPointsMe } from '../api/points'

/** 포인트 요약 쿼리 키. 룰렛/구매 성공 시 invalidateQueries로 잔액 즉시 갱신용 */
export const POINTS_ME_QUERY_KEY = ['points', 'me'] as const

/**
 * GET /api/v1/points/me를 호출하는 TanStack Query 훅
 * 로딩/에러 시 UI에서 분기 처리 가능
 * @returns useQuery 결과 (data: 가용 잔액, 7일 만료 예정 등)
 */
export function usePointsMe() {
  return useQuery({
    queryKey: POINTS_ME_QUERY_KEY,
    queryFn: fetchPointsMe,
    staleTime: 60 * 1000,
  })
}
