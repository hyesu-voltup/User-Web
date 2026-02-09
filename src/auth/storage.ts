/**
 * 로그인 사용자 식별자 저장 키
 * localStorage 키 충돌 방지를 위해 앱 전용 prefix 사용
 */
const USER_ID_STORAGE_KEY = 'lg_voltup_user_id'

/**
 * localStorage에 저장된 userId 조회
 * @returns userId 또는 null (미로그인)
 */
export function getStoredUserId(): string | null {
  try {
    return localStorage.getItem(USER_ID_STORAGE_KEY)
  } catch {
    return null
  }
}

/**
 * 로그인 성공 시 userId 저장
 * @param userId - 서버에서 받은 사용자 ID
 */
export function setStoredUserId(userId: string): void {
  try {
    localStorage.setItem(USER_ID_STORAGE_KEY, userId)
  } catch {
    // storage 풀 등 예외 시 무시
  }
}

/**
 * 로그아웃 시 저장된 userId 제거
 */
export function clearStoredUserId(): void {
  try {
    localStorage.removeItem(USER_ID_STORAGE_KEY)
  } catch {
    // no-op
  }
}
