import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getStoredUserId,
  setStoredUserId,
  clearStoredUserId,
} from './storage'

type AuthContextValue = {
  /** 현재 로그인한 사용자 ID (없으면 null) */
  userId: string | null
  /** 로그인 여부 */
  isAuthenticated: boolean
  /** 로그인 처리 (저장 후 내부 상태 갱신) */
  login: (userId: string) => void
  /** 로그아웃 (저장값 제거 후 상태 갱신) */
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

/** 초기값: localStorage에서 복원 */
function getInitialUserId(): string | null {
  return getStoredUserId()
}

/**
 * 인증 상태 제공 (userId 저장/조회, 로그인/로그아웃)
 * 로그인하지 않은 사용자는 로그인 페이지로 보내는 것은 ProtectedRoute에서 처리
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(getInitialUserId)
  const navigate = useNavigate()

  const login = useCallback(
    (id: string) => {
      setStoredUserId(id)
      setUserId(id)
      navigate('/', { replace: true })
    },
    [navigate]
  )

  const logout = useCallback(() => {
    clearStoredUserId()
    setUserId(null)
    navigate('/login', { replace: true })
  }, [navigate])

  const value = useMemo<AuthContextValue>(
    () => ({
      userId,
      isAuthenticated: !!userId,
      login,
      logout,
    }),
    [userId, login, logout]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * AuthContext 사용 훅
 * @returns AuthContextValue
 * @throws AuthProvider 밖에서 사용 시
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
