import { useEffect, useRef } from 'react'

// Layer 1: large slow background nebula clouds
const BG_COLORS = [
  [91, 33, 182],    // deep purple-800
  [109, 40, 217],   // purple-700
  [124, 58, 237],   // purple-600
]

// Layer 2: mid-density swirling clouds
const MID_COLORS = [
  [124, 58, 237],   // purple-600
  [139, 92, 246],   // violet-400
  [168, 85, 247],   // purple-400
]

// Layer 3: bright wisps
const WISP_COLORS = [
  [192, 132, 252],  // purple-300
  [216, 180, 254],  // purple-200
  [168, 85, 247],   // purple-400
]

function makeBlob(w, h, colors, radiusMin, radiusMax, speedScale, alphaMin, alphaMax) {
  const [r, g, b] = colors[Math.floor(Math.random() * colors.length)]
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    radius: radiusMin + Math.random() * (radiusMax - radiusMin),
    vx: (Math.random() - 0.5) * speedScale,
    vy: (Math.random() - 0.5) * speedScale * 0.5,
    r, g, b,
    alpha: alphaMin + Math.random() * (alphaMax - alphaMin),
    // Two independent wave components for organic turbulence
    phaseA: Math.random() * Math.PI * 2,
    phaseB: Math.random() * Math.PI * 2,
    freqA: 0.00012 + Math.random() * 0.00015,
    freqB: 0.00008 + Math.random() * 0.0001,
    ampA: 0.08 + Math.random() * 0.12,
    ampB: 0.05 + Math.random() * 0.08,
  }
}

function PillarsText() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    const text = 'PILLARS.'

    const setup = () => {
      const fontSize = Math.min(72, Math.max(42, window.innerWidth * 0.055))
      ctx.font = `300 ${fontSize}px Lato, sans-serif`
      const metrics = ctx.measureText(text)
      const w = metrics.width + 12
      const h = fontSize * 1.2
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.scale(dpr, dpr)
      return { w, h, fontSize }
    }

    let { w, h, fontSize } = setup()

    // Three layered groups for depth
    let bgBlobs, midBlobs, wispBlobs

    const initBlobs = () => {
      bgBlobs   = Array.from({ length: 12 }, () => makeBlob(w, h, BG_COLORS,   60, 100, 0.05, 0.55, 0.80))
      midBlobs  = Array.from({ length: 20 }, () => makeBlob(w, h, MID_COLORS,  35, 70,  0.08, 0.60, 0.85))
      wispBlobs = Array.from({ length: 16 }, () => makeBlob(w, h, WISP_COLORS, 15, 40,  0.10, 0.50, 0.75))
    }

    initBlobs()

    const updateAndDraw = (blobs, t) => {
      blobs.forEach(b => {
        // Compound organic motion: base drift + two orthogonal sine waves
        b.x += b.vx + Math.sin(t * b.freqA + b.phaseA) * b.ampA
        b.y += b.vy + Math.cos(t * b.freqB + b.phaseB) * b.ampB

        if (b.x < -b.radius) b.x = w + b.radius
        if (b.x > w + b.radius) b.x = -b.radius
        if (b.y < -b.radius) b.y = h + b.radius
        if (b.y > h + b.radius) b.y = -b.radius

        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius)
        grad.addColorStop(0,    `rgba(${b.r},${b.g},${b.b},${b.alpha})`)
        grad.addColorStop(0.5,  `rgba(${b.r},${b.g},${b.b},${(b.alpha * 0.75).toFixed(3)})`)
        grad.addColorStop(0.8,  `rgba(${b.r},${b.g},${b.b},${(b.alpha * 0.30).toFixed(3)})`)
        grad.addColorStop(1,    `rgba(${b.r},${b.g},${b.b},0)`)

        ctx.beginPath()
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()
      })
    }

    let animId

    const animate = (t) => {
      ctx.clearRect(0, 0, w, h)

      // Background nebula layer — additive blending for glow
      ctx.globalCompositeOperation = 'lighter'
      updateAndDraw(bgBlobs, t)

      // Mid layer
      ctx.globalCompositeOperation = 'lighter'
      updateAndDraw(midBlobs, t)

      // Wisp layer — slightly softer
      ctx.globalCompositeOperation = 'screen'
      updateAndDraw(wispBlobs, t)

      // Clip all painted content to the text shape
      ctx.globalCompositeOperation = 'destination-in'
      ctx.font = `300 ${fontSize}px Lato, sans-serif`
      ctx.fillStyle = '#fff'
      ctx.fillText(text, 4, fontSize * 0.95)

      ctx.globalCompositeOperation = 'source-over'

      animId = requestAnimationFrame(animate)
    }

    document.fonts.ready.then(() => {
      ;({ w, h, fontSize } = setup())
      initBlobs()
      animId = requestAnimationFrame(animate)
    })

    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'inline-block', verticalAlign: 'baseline', marginBottom: '0' }}
    />
  )
}

export default PillarsText
