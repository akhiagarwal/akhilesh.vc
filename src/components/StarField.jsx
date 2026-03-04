import { useMemo } from 'react'
import './StarField.css'

function seededRand(seed) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

// Three groups with distinct twinkle speeds
const GROUPS = [
  { key: 'slow',   count: 140, durationMin: 6,  durationMax: 10 },
  { key: 'medium', count: 160, durationMin: 3,  durationMax: 6  },
  { key: 'fast',   count: 100, durationMin: 1.2, durationMax: 3  },
]

function StarField() {
  const stars = useMemo(() => {
    const rand = seededRand(42)
    return GROUPS.flatMap(({ key, count, durationMin, durationMax }) =>
      Array.from({ length: count }, (_, i) => ({
        id: `${key}-${i}`,
        group: key,
        x: rand() * 100,
        y: rand() * 100,
        size: rand() < 0.4 ? 0.5 : rand() < 0.75 ? 1 : rand() < 0.92 ? 1.5 : rand() < 0.98 ? 2.5 : 3.5,
        baseOpacity: 0.20 + rand() * 0.35,
        duration: durationMin + rand() * (durationMax - durationMin),
        delay: rand() * durationMax * 2,
      }))
    )
  }, [])

  return (
    <div className="starfield-global" aria-hidden="true">
      {stars.map(s => (
        <span
          key={s.id}
          className={`gstar gstar--${s.group}`}
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            '--base-op': s.baseOpacity,
            animationDuration: `${s.duration}s`,
            animationDelay: `-${s.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

export default StarField
