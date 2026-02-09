import axios, { type AxiosInstance } from 'axios'
import { getStoredUserId } from '../auth/storage'

/**
 * API 베이스 URL (환경변수 또는 기본값)
 * 보안: 실제 운영에서는 .env로 관리 권장
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

/**
 * X-User-Id 헤더를 붙인 Axios 인스턴스
 * - 로그인 후 저장된 userId를 매 요청마다 헤더에 실어 보냄
 * - 인증되지 않은 경우 헤더 없이 요청 가능 (로그인 API 등)
 * @returns AxiosInstance
 */
function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  client.interceptors.request.use((config) => {
    const userId = getStoredUserId()
    if (userId) {
      config.headers['X-User-Id'] = userId
    }
    return config
  })

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // 서버가 401을 반환하면 저장된 userId 제거 후 로그인 페이지로 보낼 수 있음 (필요 시 여기서 처리)
        // 현재는 클라이언트에서 로그인 여부만 체크하므로 401 시 별도 처리 선택
      }
      return Promise.reject(error)
    }
  )

  return client
}

/** 전역 API 클라이언트 (X-User-Id 자동 부착) */
export const apiClient = createApiClient()

export default apiClient
