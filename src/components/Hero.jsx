import './Hero.css'
import DeeptechWheel from './DeeptechWheel'
import PillarsText from './PillarsText'

function Hero() {
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
          <a href="#contact" className="hero-cta">
            Get in Touch
            <span className="hero-cta-arrow">&rarr;</span>
          </a>
        </div>

        <div className="hero-visual">
          <DeeptechWheel />
        </div>
      </div>
    </section>
  )
}

export default Hero
