import axios, { type AxiosInstance } from 'axios'
import { getStoredUserId } from '../auth/storage'

/**
 * API 베이스 URL
 * - 개발(DEV): 항상 '/api' → Vite 프록시가 백엔드로 전달해 CORS 없이 요청
 * - 프로덕션: .env의 VITE_API_BASE_URL 사용 (백엔드가 CORS 허용해야 함)
 */
function getBaseURL(): string {
  if (import.meta.env.DEV) return '/api'
  const raw = (import.meta.env.VITE_API_BASE_URL ?? '').toString().trim().replace(/\/+$/, '')
  if (!raw) return '/api'
  return raw.endsWith('/api') ? raw : `${raw}/api`
}
const BASE_URL = getBaseURL()

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
