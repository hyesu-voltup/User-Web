import { useState, useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getRouletteStatus, postRouletteParticipate } from '../api/roulette'
import { getRouletteErrorMessage, isAlreadyParticipatedError } from '../lib/rouletteErrors'
import { POINTS_ME_QUERY_KEY } from '../hooks/usePointsMe'
import { RouletteWheel } from './RouletteWheel'

function ResultModal({
  grantedPoint,
  onClose,
}: {
  grantedPoint: number
  onClose: () => void
}) {
  const isWin = grantedPoint > 0
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" role="dialog" aria-modal="true" aria-labelledby="roulette-result-title">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h2 id="roulette-result-title" className="text-lg font-bold text-center text-content">
          {isWin ? '축하합니다!' : '아쉬워요'}
        </h2>
        <p className="mt-3 text-center text-content-secondary">
          {isWin
            ? `${grantedPoint.toLocaleString()}P가 적립되었어요.`
            : '이번에는 꽝이에요. 내일 다시 도전해 주세요!'}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="w-full mt-6 py-3 rounded-xl bg-brand text-content font-medium hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-brand"
        >
          확인
        </button>
      </div>
    </div>
  )
}

/**
 * 홈에 넣을 룰렛 블록 (참여 여부, 휠, 돌리기 버튼, 결과 모달)
 */
export function RouletteSection() {
  const queryClient = useQueryClient()
  const [isSpinning, setIsSpinning] = useState(false)
  const [result, setResult] = useState<number | null>(null)
  const [localParticipated, setLocalParticipated] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { data: statusData, isLoading: isStatusLoading } = useQuery({
    queryKey: ['roulette', 'status'],
    queryFn: getRouletteStatus,
    retry: false,
    staleTime: 60 * 1000,
  })

  const participatedToday = statusData?.participatedToday ?? localParticipated

  const runRoulette = useCallback(async () => {
    if (isSpinning || participatedToday) return
    setIsSpinning(true)
    setErrorMessage(null)
    try {
      const data = await postRouletteParticipate()
      setResult(data.grantedPoint ?? 0)
      queryClient.invalidateQueries({ queryKey: POINTS_ME_QUERY_KEY })
    } catch (err) {
      if (isAlreadyParticipatedError(err)) {
        setLocalParticipated(true)
      }
      setErrorMessage(getRouletteErrorMessage(err))
    } finally {
      setIsSpinning(false)
    }
  }, [isSpinning, participatedToday, queryClient])

  const closeResult = useCallback(() => setResult(null), [])

  return (
    <section className="mt-6" aria-label="룰렛">
      <h2 className="text-lg font-bold text-content">룰렛</h2>
      <p className="mt-1 text-content-secondary text-sm">
        당일 1회 참여 가능. 룰렛을 돌려 포인트를 받아보세요.
      </p>

      {isStatusLoading && !localParticipated && (
        <p className="mt-4 text-center text-content-muted text-sm">참여 여부 확인 중...</p>
      )}
      {participatedToday && (
        <div className="mt-4 p-4 rounded-xl bg-bg-subtle border border-tabbar-border">
          <p className="text-center text-content-secondary font-medium">
            내일 다시 참여해 주세요.
          </p>
          <p className="mt-1 text-center text-content-muted text-sm">
            오늘은 이미 참여하셨습니다.
          </p>
        </div>
      )}

      {!participatedToday && (
        <div className="mt-4 flex flex-col items-center">
          <RouletteWheel isSpinning={isSpinning} result={result} size={260} />
          <p className="mt-2 text-content-muted text-sm">
            {isSpinning ? '룰렛 진행 중...' : result === null ? '돌리기 버튼을 눌러주세요' : ''}
          </p>
          <button
            type="button"
            onClick={runRoulette}
            disabled={isSpinning}
            className="mt-4 w-full max-w-xs py-3 rounded-xl bg-brand text-content font-medium hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-brand disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSpinning ? '룰렛 돌리는 중...' : '룰렛 돌리기'}
          </button>
        </div>
      )}

      {errorMessage && (
        <p className="mt-4 text-center text-red-600 text-sm" role="alert">
          {errorMessage}
        </p>
      )}

      {result !== null && (
        <ResultModal grantedPoint={result} onClose={closeResult} />
      )}
    </section>
  )
}
