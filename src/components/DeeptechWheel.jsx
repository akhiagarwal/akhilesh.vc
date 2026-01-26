import { useState, useEffect } from 'react'
import './DeeptechWheel.css'

// Placeholder images - replace with actual assets in /public/deeptech/wheel/
const SECTOR_IMAGES = {
  life: 'https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=800&h=800&fit=crop', // DNA
  matter: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=800&fit=crop', // Circuits
  motion: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&h=800&fit=crop', // Space
  intelligence: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=800&fit=crop', // AI
  energy: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=800&fit=crop', // Energy
}

const SPHERE_IMAGE = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=400&fit=crop' // Earth/Globe

function DeeptechWheel() {
  const [isHovered, setIsHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className="deeptech-wheel-container">
      {/* Starfield particles background */}
      <div className="starfield">
        {[...Array(50)].map((_, i) => (
          <span key={i} className="star" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }} />
        ))}
      </div>

      {/* Main wheel wrapper with 3D perspective */}
      <div
        className={`deeptech-wheel-wrapper ${isHovered ? 'hovered' : ''} ${isMobile ? 'mobile' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Outer glow ring */}
        <div className="wheel-outer-glow" />

        {/* Edge feather gradient */}
        <div className="wheel-edge-feather" />

        {/* Main rotating wheel */}
        <div className="deeptech-wheel">
          {/* 5 Sector slices - each 72 degrees */}
          <div className="wheel-sector sector-1">
            <div className="sector-image-wrapper">
              <img src={SECTOR_IMAGES.life} alt="Life - Biotech & DNA" />
            </div>
          </div>

          <div className="wheel-sector sector-2">
            <div className="sector-image-wrapper">
              <img src={SECTOR_IMAGES.matter} alt="Matter - Technology & Materials" />
            </div>
          </div>

          <div className="wheel-sector sector-3">
            <div className="sector-image-wrapper">
              <img src={SECTOR_IMAGES.motion} alt="Motion - Space & Aerospace" />
            </div>
          </div>

          <div className="wheel-sector sector-4">
            <div className="sector-image-wrapper">
              <img src={SECTOR_IMAGES.intelligence} alt="Intelligence - AI & Computing" />
            </div>
          </div>

          <div className="wheel-sector sector-5">
            <div className="sector-image-wrapper">
              <img src={SECTOR_IMAGES.energy} alt="Energy - Power & Sustainability" />
            </div>
          </div>

          {/* Sector divider lines */}
          <div className="sector-dividers">
            <span className="divider divider-1" />
            <span className="divider divider-2" />
            <span className="divider divider-3" />
            <span className="divider divider-4" />
            <span className="divider divider-5" />
          </div>

          {/* Inner shadow for depth */}
          <div className="wheel-inner-shadow" />

          {/* Color blend overlay */}
          <div className="wheel-color-overlay" />
        </div>

        {/* Central sphere */}
        <div className="central-sphere-container">
          <div className="sphere-glow" />
          <div className="sphere-bloom" />
          <div className="central-sphere">
            <img src={SPHERE_IMAGE} alt="Central sphere" />
            <div className="sphere-highlight" />
            <div className="sphere-reflection" />
          </div>
        </div>

        {/* Orbital rings */}
        <div className="orbital-ring ring-inner" />
        <div className="orbital-ring ring-outer" />
      </div>
    </div>
  )
}

export default DeeptechWheel
