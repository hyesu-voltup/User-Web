import { useEffect, useRef, useState } from 'react'

/** 휠 8칸: [꽝, 100P, 꽝, 50P, 꽝, 30P, 꽝, 10P] - 인덱스별 포인트 */
const SEGMENTS = [0, 100, 0, 50, 0, 30, 0, 10]
const SEGMENT_DEG = 360 / SEGMENTS.length

/**
 * grantedPoint에 해당하는 칸 인덱스. 없으면 꽝(0) 또는 당첨 대표 칸(100P)으로 매핑
 */
function getSegmentIndex(grantedPoint: number): number {
  const i = SEGMENTS.indexOf(grantedPoint)
  if (i >= 0) return i
  if (grantedPoint > 0) return 1
  return 0
}

/** ease-out cubic: 끝에서 부드럽게 감속 */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

type Props = {
  isSpinning: boolean
  result: number | null
  size?: number
}

/**
 * 룰렛 휠: isSpinning 동안 연속 회전, result 수신 시 해당 칸으로 감속 정지
 * requestAnimationFrame으로 60fps 부드러운 애니메이션
 */
export function RouletteWheel({ isSpinning, result, size = 240 }: Props) {
  const rotationRef = useRef(0)
  const [, forceUpdate] = useState(0)
  const rafRef = useRef<number>(0)
  const landingStartRef = useRef<{ startRotation: number; targetRotation: number; startTime: number } | null>(null)

  const segmentIndex = result !== null ? getSegmentIndex(result) : 0
  const targetRemainder = segmentIndex * SEGMENT_DEG

  useEffect(() => {
    if (!isSpinning) return

    let last = performance.now()
    const spinSpeed = 0.28 // deg per ms

    const tick = (now: number) => {
      const dt = Math.min(now - last, 50)
      last = now
      rotationRef.current += spinSpeed * dt
      forceUpdate((n) => n + 1)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [isSpinning])

  useEffect(() => {
    if (result === null || isSpinning) return

    const startRotation = rotationRef.current
    const remainder = ((startRotation % 360) + 360) % 360
    let needToAdd = (targetRemainder - remainder + 360) % 360
    if (needToAdd < 180) needToAdd += 360
    const targetRotation = startRotation + needToAdd + 360 * 2
    landingStartRef.current = { startRotation, targetRotation, startTime: performance.now() }
  }, [result, isSpinning, targetRemainder])

  useEffect(() => {
    const landing = landingStartRef.current
    if (!landing) return

    const duration = 1600

    const tick = (now: number) => {
      const elapsed = now - landing.startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOutCubic(progress)
      rotationRef.current = landing.startRotation + (landing.targetRotation - landing.startRotation) * eased
      forceUpdate((n) => n + 1)
      if (progress < 1) rafRef.current = requestAnimationFrame(tick)
      else landingStartRef.current = null
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [result])

  const rotation = rotationRef.current

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* 상단 포인터 (정지 시 해당 칸 가리킴) */}
      <div
        className="absolute top-0 left-1/2 z-10 -translate-x-1/2 -translate-y-1"
        style={{ width: 0, height: 0, borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderTop: '20px solid var(--color-tabbar-active, #E4FF30)' }}
        aria-hidden
      />
      {/* 휠 컨테이너: 원형 클리핑 */}
      <div
        className="overflow-hidden rounded-full border-4 border-tabbar-border shadow-lg"
        style={{ width: size, height: size }}
      >
        <div
          className="rounded-full"
          style={{
            width: size,
            height: size,
            transform: `rotate(${rotation}deg)`,
            willChange: 'transform',
            background: `conic-gradient(from 0deg, ${SEGMENTS.map((point, i) => {
              const start = (i * SEGMENT_DEG) % 360
              const isZero = point === 0
              const color = isZero ? '#e5e7eb' : i % 2 === 0 ? '#f7ffe0' : '#e8f5e0'
              return `${color} ${start}deg ${start + SEGMENT_DEG}deg`
            }).join(', ')})`,
          }}
        >
          {/* 칸 경계선 및 라벨 */}
          {SEGMENTS.map((point, i) => (
            <div
              key={i}
              className="absolute inset-0 flex items-center justify-center"
              style={{
                transform: `rotate(${i * SEGMENT_DEG + SEGMENT_DEG / 2}deg)`,
                transformOrigin: 'center center',
              }}
            >
              <span
                className="text-xs font-bold text-content"
                style={{
                  transform: `translateY(-${size / 2 - 20}px)`,
                  textShadow: '0 0 2px #fff',
                }}
              >
                {point === 0 ? '꽝' : `${point}P`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
