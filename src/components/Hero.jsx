import DeeptechWheel from './DeeptechWheel'
import './Hero.css'

function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg-mesh"></div>
      <div className="container hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            INVESTING IN<br />
            CIVILIZATIONAL<br />
            <span className="gradient-text animated">PILLARS.</span>
          </h1>
          <p className="hero-subtitle">
            Backing visionary founders who are consciously and deliberately
            shaping a resilient and thriving future for our species.
          </p>
        </div>

        <div className="hero-visual">
          <DeeptechWheel />
        </div>
      </div>
    </section>
  )
}

export default Hero
