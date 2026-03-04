import { useState, useEffect, useRef, useCallback } from 'react'
import './DeeptechWheel.css'

const SECTOR_IMAGES = {
  life: 'https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=800&h=800&fit=crop',
  matter: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=800&fit=crop',
  motion: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&h=800&fit=crop',
  intelligence: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=800&fit=crop',
  energy: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=800&fit=crop',
}

const SPHERE_IMAGE = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=400&fit=crop'

function DeeptechWheel() {
  const [isHovered, setIsHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef(null)
  const wrapperRef = useRef(null)
  const frameRef = useRef(null)
  const targetRef = useRef({ x: -25, y: -15 }) // dramatic start angle for entrance
  const currentRef = useRef({ x: -25, y: -15 })
  const isIdleRef = useRef(true)
  const idleTimerRef = useRef(null)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleMouseMove = useCallback((e) => {
    if (isMobile) return
    const el = containerRef.current
    if (!el) return
    isIdleRef.current = false
    clearTimeout(idleTimerRef.current)
    const rect = el.getBoundingClientRect()
    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)
    targetRef.current = { x: dx * 14, y: dy * 9 + 5 }
    idleTimerRef.current = setTimeout(() => { isIdleRef.current = true }, 2200)
  }, [isMobile])

  useEffect(() => {
    if (isMobile) return
    const animate = (time) => {
      if (isIdleRef.current) {
        targetRef.current = {
          x: Math.sin(time * 0.00042) * 8,
          y: Math.cos(time * 0.00028) * 4 + 5,
        }
      }
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.045
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.045
      if (wrapperRef.current) {
        wrapperRef.current.style.transform =
          `rotateY(${currentRef.current.x}deg) rotateX(${-currentRef.current.y}deg)`
      }
      frameRef.current = requestAnimationFrame(animate)
    }
    frameRef.current = requestAnimationFrame(animate)
    return () => {
      cancelAnimationFrame(frameRef.current)
      clearTimeout(idleTimerRef.current)
    }
  }, [isMobile])

  return (
    <div
      className="deeptech-wheel-container"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main wheel wrapper with 3D perspective */}
      <div
        className={`deeptech-wheel-wrapper ${isHovered ? 'hovered' : ''} ${isMobile ? 'mobile' : ''}`}
        ref={wrapperRef}
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
