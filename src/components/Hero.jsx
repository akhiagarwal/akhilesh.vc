import { useState, useEffect, useRef } from 'react'
import './Hero.css'

const metrics = [
  { value: 5, suffix: '+', label: 'Years' },
  { value: 12, suffix: '+', label: 'Portfolio Companies' },
  { value: 5, suffix: '', label: 'Pillars of Focus' },
  { value: 2, suffix: '', label: 'Fund Types' },
]

function AnimatedCounter({ target, suffix }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          let start = 0
          const duration = 1500
          const startTime = performance.now()

          const animate = (currentTime) => {
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * target))
            if (progress < 1) requestAnimationFrame(animate)
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  )
}

function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg">
        <div className="hero-glow"></div>
      </div>
      <div className="container hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Backing founders shaping <span className="gradient-text">tomorrow</span>
          </h1>
          <p className="hero-subtitle">
            Early-stage DeepTech investor focused on the civilizational pillars
            of Life, Matter, Motion, Intelligence, and Energy. Partnering with
            ambitious founders building at the frontiers of science & engineering.
          </p>
          <a href="#contact" className="hero-cta">
            Get in Touch
            <span className="hero-cta-arrow">&rarr;</span>
          </a>
        </div>

        <div className="hero-visual">
          <div className="hero-orb">
            <div className="orb-inner"></div>
            <div className="orb-ring orb-ring-1"></div>
            <div className="orb-ring orb-ring-2"></div>
            <div className="orb-pulse"></div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="hero-metrics">
          {metrics.map((metric, i) => (
            <div key={i} className="metric-item">
              <div className="metric-value">
                <AnimatedCounter target={metric.value} suffix={metric.suffix} />
              </div>
              <div className="metric-label">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero
