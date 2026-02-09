/**
 * 룰렛/이벤트 API 에러 코드 → 사용자용 안내 메시지
 * 유저는 C007, C011 등 코드를 이해하지 못 하므로 부드러운 문구로 치환
 */
const ROULETTE_ERROR_MESSAGES: Record<string, string> = {
  C007: '이미 오늘 참여하셨습니다. 내일 다시 참여해 주세요.',
  C011: '죄송합니다. 오늘 준비된 예산이 모두 소진되어 포인트 지급이 어렵습니다.',
}

const FALLBACK = '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'

/**
 * API 에러에서 사용자에게 보여줄 메시지 반환
 * @param err - catch된 에러 (axios 등)
 * @returns 사용자용 한글 메시지
 */
export function getRouletteErrorMessage(err: unknown): string {
  if (!err || typeof err !== 'object' || !('response' in err)) return FALLBACK
  const res = (err as { response?: { data?: { code?: string; message?: string } } }).response
  const code = res?.data?.code
  const message = res?.data?.message
  if (code && ROULETTE_ERROR_MESSAGES[code]) return ROULETTE_ERROR_MESSAGES[code]
  if (typeof message === 'string' && message.trim()) return message.trim()
  return FALLBACK
}

/** C007(이미 참여) 여부 확인 - 참여 불가 메시지 노출용 */
export function isAlreadyParticipatedError(err: unknown): boolean {
  if (!err || typeof err !== 'object' || !('response' in err)) return false
  const code = (err as { response?: { data?: { code?: string } } }).response?.data?.code
  return code === 'C007'
}
