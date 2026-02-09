import axios, { type AxiosInstance } from 'axios'
import { getStoredUserId } from '../auth/storage'

/**
 * Vite 환경 변수: VITE_ 접두사만 클라이언트에 노출됨.
 * .env / .env.production / Vercel 환경 변수에서 로드.
 * @see https://vitejs.dev/guide/env-and-mode.html
 */
const ENV_API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '').toString().trim().replace(/\/+$/, '')

/** 환경 변수 미설정 시 사용할 기본 백엔드 주소 (절대 URL). 상대 경로 사용 시 Vercel 도메인으로 요청되어 405 발생 */
const DEFAULT_API_BASE_URL = 'https://voltupbe.onrender.com/api'

/**
 * API 베이스 URL
 * - 개발(DEV): '/api' → Vite 프록시가 백엔드로 전달 (CORS 회피)
 * - 프로덕션: VITE_API_BASE_URL 사용. 없으면 DEFAULT_API_BASE_URL (절대 URL) 사용
 */
function getBaseURL(): string {
  if (import.meta.env.DEV) return '/api'
  if (ENV_API_BASE) return ENV_API_BASE.endsWith('/api') ? ENV_API_BASE : `${ENV_API_BASE}/api`
  return DEFAULT_API_BASE_URL
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
