import { apiClient } from './client'

/**
 * POST /api/v1/auth/login (간편 로그인) 응답
 * 없으면 자동 생성 후 userId 반환. 이 id를 X-User-Id로 사용
 */
export type AuthLoginResponse = {
  userId: string
}

/**
 * 간편 로그인: 닉네임만 입력. 없으면 자동 생성 후 userId 반환
 * @param nickname - 닉네임(또는 아이디)
 * @returns Promise<AuthLoginResponse>
 */
export async function postAuthLogin(nickname: string): Promise<AuthLoginResponse> {
  const { data } = await apiClient.post<AuthLoginResponse>('/v1/auth/login', {
    nickname: nickname.trim(),
  })
  return data
}
