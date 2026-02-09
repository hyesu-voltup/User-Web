import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

type ProtectedRouteProps = {
  children: React.ReactNode
}

/**
 * 로그인하지 않은 사용자를 로그인 페이지로 리다이렉트
 * @param children - 인증 시 렌더할 자식
 * @returns 인증 시 children, 미인증 시 /login으로 리다이렉트 (returnUrl 쿼리로 복귀 경로 전달)
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    const returnUrl = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/login?returnUrl=${returnUrl}`} replace />
  }

  return <>{children}</>
}
