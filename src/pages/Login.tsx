import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { postAuthLogin } from '../api/auth'

/**
 * 로그인 페이지
 * 닉네임만 입력. POST /api/v1/auth/login(간편 로그인) 호출 — 없으면 자동 생성 후 userId 반환
 */
export default function Login() {
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const returnUrl = searchParams.get('returnUrl') ?? '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const trimmed = nickname.trim()
    if (!trimmed) {
      setError('닉네임을 입력해 주세요.')
      return
    }
    setLoading(true)
    try {
      const data = await postAuthLogin(trimmed)
      if (data?.userId) {
        login(data.userId, trimmed)
        navigate(returnUrl, { replace: true })
      } else {
        setError('로그인 정보를 받지 못했습니다.')
      }
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null
      setError(message ?? '로그인에 실패했습니다. 다시 시도해 주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <div className="flex-1 flex flex-col justify-center px-6 py-12">
        <div className="mx-auto w-full max-w-sm">
          <h1 className="text-2xl font-bold text-center text-content mb-2">
            LG 볼트업
          </h1>
          <p className="text-center text-content-secondary text-sm mb-8">
            닉네임을 입력하고 시작하세요
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label htmlFor="nickname" className="block text-sm font-medium text-content">
              닉네임
            </label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임 입력"
              autoComplete="username"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-content placeholder:text-content-muted focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
              disabled={loading}
            />
            {error && (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-brand text-content font-medium hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '로그인 중...' : '시작하기'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
