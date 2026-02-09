import { apiClient } from './client'

/**
 * POST /api/v1/users 요청 body
 * 로그인 시 닉네임만 넣을 수 있도록 간편하게 loginId, name 동일 값 사용 가능
 */
export type CreateUserRequest = {
  loginId: string
  name: string
}

/**
 * POST /api/v1/users 응답
 * id는 X-User-Id로 룰렛·포인트·상품 등 모든 API에 사용
 */
export type CreateUserResponse = {
  id: string
  loginId: string
  name: string
}

/**
 * 사용자 생성 (로그인 흐름)
 * 신규 사용자 생성 또는 기존 사용자 조회 후 id 반환. 해당 id를 X-User-Id로 저장
 * @param body - loginId, name (닉네임만 입력 시 둘 다 같은 값으로 전달)
 * @returns Promise<CreateUserResponse>
 */
export async function createUser(body: CreateUserRequest): Promise<CreateUserResponse> {
  const { data } = await apiClient.post<CreateUserResponse>('/v1/users', body)
  return data
}
