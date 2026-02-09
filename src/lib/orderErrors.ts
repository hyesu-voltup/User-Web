/**
 * 주문 API 에러 코드 → 사용자용 안내 메시지 (toast 등)
 */
const ORDER_ERROR_MESSAGES: Record<string, string> = {
  C005: '보유 포인트가 부족합니다. 포인트를 충전하거나 적립 후 다시 시도해 주세요.',
  C006: '선택한 상품의 재고가 부족합니다. 수량을 줄이거나 나중에 다시 시도해 주세요.',
}

const FALLBACK = '주문 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.'

/**
 * 주문 API 에러에서 토스트에 보여줄 메시지 반환
 */
export function getOrderErrorMessage(err: unknown): string {
  if (!err || typeof err !== 'object' || !('response' in err)) return FALLBACK
  const res = (err as { response?: { data?: { code?: string; message?: string } } }).response
  const code = res?.data?.code
  const message = res?.data?.message
  if (code && ORDER_ERROR_MESSAGES[code]) return ORDER_ERROR_MESSAGES[code]
  if (typeof message === 'string' && message.trim()) return message.trim()
  return FALLBACK
}
