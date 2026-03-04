import { useState } from 'react'
import './Hero.css'
import CivPillar, { PILLARS, TOOLTIP_ORDER } from './CivPillar'
import PillarsText from './PillarsText'

function Hero() {
  const [hoveredPillar, setHoveredPillar] = useState(null)

  return (
    <section className="hero">
      <div className="hero-bg">
        <div className="hero-glow"></div>
      </div>
      <div className="container hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            INVESTING IN<br />CIVILIZATIONAL <PillarsText />
          </h1>
          <p className="hero-subtitle">
            Backing visionary founders who are consciously and deliberately shaping a resilient and thriving future for our species.
          </p>
        </div>

        <div className="hero-visual">
          <CivPillar onPillarHover={setHoveredPillar} />
        </div>
      </div>

      {/* Pillar tooltips — full-width row in separator area */}
      <div className="pillars-tooltip container">
        {TOOLTIP_ORDER.map(id => {
          const p = PILLARS.find(x => x.id === id)
          return (
            <div
              key={p.id}
              className={`pillars-tooltip-slot ${hoveredPillar === p.id ? 'pillars-tooltip-slot--active' : ''}`}
              style={{ '--c': p.color }}
            >
              <span className="pillars-tooltip-name">{p.label}</span>
              <p className="pillars-tooltip-desc">{p.desc}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default Hero
