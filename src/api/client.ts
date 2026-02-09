import axios, { type AxiosInstance } from 'axios'
import { getStoredUserId } from '../auth/storage'

/**
 * Vite 환경 변수 (빌드 시 주입)
 * .env / .env.production / Vercel 환경 변수에서 로드.
 * @see https://vitejs.dev/guide/env-and-mode.html
 */
const ENV_API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '').toString().trim().replace(/\/+$/, '')
/** CORS 우회: true 이면 프로덕션에서도 상대 경로 /api 사용 → Vercel rewrites로 백엔드 프록시 */
const USE_API_PROXY = (import.meta.env.VITE_USE_API_PROXY ?? '').toString().toLowerCase() === 'true'
/** 환경 변수 미설정 시 사용할 기본 백엔드 주소 (절대 URL) */
const DEFAULT_API_BASE_URL = 'https://voltupbe.onrender.com/api'

/**
 * API 베이스 URL
 * - 개발(DEV): '/api' → Vite 프록시 (CORS 회피)
 * - 프로덕션 + VITE_USE_API_PROXY=true: '/api' → Vercel rewrites가 백엔드로 프록시 (CORS 없음)
 * - 프로덕션 그 외: VITE_API_BASE_URL 또는 DEFAULT_API_BASE_URL (직접 요청, 백엔드 CORS 필요)
 */
function getBaseURL(): string {
  if (import.meta.env.DEV) return '/api'
  if (USE_API_PROXY) return '/api'
  if (ENV_API_BASE) return ENV_API_BASE.endsWith('/api') ? ENV_API_BASE : `${ENV_API_BASE}/api`
  return DEFAULT_API_BASE_URL
}
const BASE_URL = getBaseURL()

/**
 * X-User-Id 헤더를 붙인 Axios 인스턴스
 * - 로그인 후 저장된 userId만 헤더에 설정 (비어 있으면 헤더 자체를 보내지 않음 → 백엔드 거절 방지)
 * - 로그인 API(POST /v1/auth/login)는 헤더 없이 호출 가능
 * - withCredentials: false (기본값). 쿠키 미사용이므로 true 불필요; true 시 CORS 시 credentials 모드로 인해 백엔드 추가 설정 필요
 */
function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
    },
    // 쿠키를 보내지 않으므로 false 유지. CORS는 프록시(VITE_USE_API_PROXY) 또는 백엔드 허용으로 해결
    withCredentials: false,
  })

  client.interceptors.request.use((config) => {
    const userId = getStoredUserId()
    // 값이 있을 때만 헤더 설정. 빈 문자열/null이면 헤더 미설정 → 보호된 API는 백엔드에서 401 등으로 거절 가능
    if (userId != null && userId !== '') {
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
