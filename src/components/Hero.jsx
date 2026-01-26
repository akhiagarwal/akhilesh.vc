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
          <div className="hero-circle">
            <div className="circle-segment segment-1">
              <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&h=500&fit=crop" alt="Circuit board - Technology" />
            </div>
            <div className="circle-segment segment-2">
              <img src="https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=500&h=500&fit=crop" alt="DNA Helix - Life" />
            </div>
            <div className="circle-segment segment-3">
              <img src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=500&h=500&fit=crop" alt="Space satellite" />
            </div>
            <div className="circle-segment segment-4">
              <img src="https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=500&h=500&fit=crop" alt="Stars and cosmos" />
            </div>
            <div className="circle-overlay"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
