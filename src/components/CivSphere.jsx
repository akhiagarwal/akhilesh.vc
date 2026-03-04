import { useEffect, useRef, useState, useCallback } from 'react'
import './CivSphere.css'

const PI2 = Math.PI * 2

// ─── Pre-computed static geometry (normalised coords, -1 to 1) ───────────────

const HEXES = (() => {
  const out = [], step = 0.115
  for (let row = -5; row <= 5; row++) {
    for (let col = -5; col <= 5; col++) {
      const nx = col * step * 1.732 + (row & 1) * step * 0.866
      const ny = row * step * 1.5
      if (nx * nx + ny * ny < 0.68) out.push({ nx, ny })
    }
  }
  return out
})()

const CIRCUITS = Array.from({ length: 16 }, (_, i) => {
  const s = i * 5.7
  const nx = 0.08 + ((s * 0.618) % 0.52) * (i % 2 === 0 ? 1 : -1)
  const ny = -0.28 + ((s * 0.314) % 0.62)
  const segs = []
  let dir = i % 2 === 0 ? 'h' : 'v'
  for (let k = 0; k < 4; k++) {
    const len = 0.04 + ((s + k) * 0.137 % 0.13)
    segs.push(dir === 'h'
      ? { dx: len * (k % 2 === 0 ? 1 : -1), dy: 0 }
      : { dx: 0, dy: len * (k % 2 === 0 ? 1 : -1) })
    dir = dir === 'h' ? 'v' : 'h'
  }
  return { nx, ny, segs, alpha: 0.18 + (s * 0.05 % 0.22) }
})

const RINGS = [
  { a: 0.58, b: 0.20, tilt: 0.42,  speed: 0.00018, phase: 0.0  },
  { a: 0.72, b: 0.16, tilt: -0.28, speed: 0.00011, phase: 2.09 },
  { a: 0.44, b: 0.26, tilt: 0.85,  speed: 0.00024, phase: 4.19 },
]

const PARTICLES = [
  ...Array.from({ length: 22 }, () => ({ nx: -0.18 + (Math.random()-0.5)*0.55, ny: 0.16 + (Math.random()-0.5)*0.50, life: Math.random(), speed: 0.0025+Math.random()*0.002, size: 0.7+Math.random()*1.3, alpha: 0.40+Math.random()*0.50, r:52,  g:211, b:153 })),
  ...Array.from({ length: 20 }, () => ({ nx:  0.26 + (Math.random()-0.5)*0.48, ny:-0.20 + (Math.random()-0.5)*0.46, life: Math.random(), speed: 0.0030+Math.random()*0.002, size: 0.6+Math.random()*1.6, alpha: 0.45+Math.random()*0.50, r:253, g:186, b:116 })),
  ...Array.from({ length: 16 }, () => ({ nx:  0.28 + (Math.random()-0.5)*0.42, ny: 0.10 + (Math.random()-0.5)*0.44, life: Math.random(), speed: 0.0022+Math.random()*0.002, size: 0.5+Math.random()*1.2, alpha: 0.35+Math.random()*0.45, r:192, g:132, b:252 })),
  ...Array.from({ length: 12 }, () => ({ nx: (Math.random()-0.5)*0.80,        ny:(Math.random()-0.5)*0.30,         life: Math.random(), speed: 0.0035+Math.random()*0.002, size: 0.5+Math.random()*1.0, alpha: 0.30+Math.random()*0.40, r:125, g:211, b:252 })),
]

const LAYER_DEFS = [
  { id: 'dna',       label: 'DNA',       color: '#34d399' },
  { id: 'lattice',   label: 'Lattice',   color: '#a78bfa' },
  { id: 'lightning', label: 'Lightning', color: '#fbbf24' },
  { id: 'rings',     label: 'Rings',     color: '#7dd3fc' },
  { id: 'circuits',  label: 'Circuits',  color: '#c084fc' },
  { id: 'particles', label: 'Particles', color: '#ffffff' },
]

// ─────────────────────────────────────────────────────────────────────────────

function CivSphere() {
  const canvasRef    = useRef(null)
  const containerRef = useRef(null)
  const wrapperRef   = useRef(null)
  const tiltFrame    = useRef(null)
  const drawFrame    = useRef(null)
  const target       = useRef({ x: -25, y: -15 })
  const current      = useRef({ x: -25, y: -15 })
  const isIdle       = useRef(true)
  const idleTimer    = useRef(null)
  const [isMobile, setIsMobile] = useState(false)

  const [layers, setLayers] = useState({
    dna: true, lattice: true, lightning: true,
    rings: true, circuits: true, particles: true,
  })
  const layersRef = useRef(layers)
  useEffect(() => { layersRef.current = layers }, [layers])

  const toggleLayer = useCallback((id) => {
    setLayers(prev => ({ ...prev, [id]: !prev[id] }))
  }, [])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const handleMouseMove = useCallback((e) => {
    if (isMobile) return
    const el = containerRef.current; if (!el) return
    isIdle.current = false
    clearTimeout(idleTimer.current)
    const rect = el.getBoundingClientRect()
    target.current = {
      x: ((e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2)) * 14,
      y: ((e.clientY - rect.top  - rect.height / 2) / (rect.height / 2)) * 9 + 5,
    }
    idleTimer.current = setTimeout(() => { isIdle.current = true }, 2200)
  }, [isMobile])

  useEffect(() => {
    if (isMobile) return
    const tick = (t) => {
      if (isIdle.current) {
        target.current = { x: Math.sin(t * 0.00042) * 8, y: Math.cos(t * 0.00028) * 4 + 5 }
      }
      current.current.x += (target.current.x - current.current.x) * 0.045
      current.current.y += (target.current.y - current.current.y) * 0.045
      if (wrapperRef.current)
        wrapperRef.current.style.transform =
          `rotateY(${current.current.x}deg) rotateX(${-current.current.y}deg)`
      tiltFrame.current = requestAnimationFrame(tick)
    }
    tiltFrame.current = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(tiltFrame.current); clearTimeout(idleTimer.current) }
  }, [isMobile])

  // ─── Canvas render loop ─────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1

    const resize = () => {
      const s = canvas.parentElement.offsetWidth
      canvas.width  = s * dpr
      canvas.height = s * dpr
      canvas.style.width  = s + 'px'
      canvas.style.height = s + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas.parentElement)

    const draw = (t) => {
      const L  = layersRef.current
      const S  = canvas.width / dpr
      const cx = S / 2, cy = S / 2
      const r  = S * 0.415
      const rot = t * 0.000095

      ctx.clearRect(0, 0, S, S)

      // ── 1. OUTER GLOW ────────────────────────────────────────────────
      const glow = ctx.createRadialGradient(cx, cy, r * 0.90, cx, cy, r * 1.15)
      glow.addColorStop(0.00, 'rgba(109, 40,217,0.48)')
      glow.addColorStop(0.40, 'rgba( 91, 33,182,0.20)')
      glow.addColorStop(0.80, 'rgba( 76, 29,149,0.05)')
      glow.addColorStop(1.00, 'rgba(  0,  0,  0,0.00)')
      ctx.fillStyle = glow
      ctx.beginPath(); ctx.arc(cx, cy, r * 1.15, 0, PI2); ctx.fill()

      const eHalo = ctx.createRadialGradient(cx + r*.52, cy - r*.42, 0, cx + r*.52, cy - r*.42, r * 0.50)
      eHalo.addColorStop(0, 'rgba(251,146,60,0.14)')
      eHalo.addColorStop(0.5, 'rgba(251,146,60,0.05)')
      eHalo.addColorStop(1, 'rgba(0,0,0,0.00)')
      ctx.fillStyle = eHalo; ctx.beginPath(); ctx.arc(cx + r*.52, cy - r*.42, r*0.50, 0, PI2); ctx.fill()

      const lHalo = ctx.createRadialGradient(cx - r*.38, cy + r*.32, 0, cx - r*.38, cy + r*.32, r * 0.60)
      lHalo.addColorStop(0, 'rgba(16,185,129,0.10)')
      lHalo.addColorStop(0.5, 'rgba(16,185,129,0.03)')
      lHalo.addColorStop(1, 'rgba(0,0,0,0.00)')
      ctx.fillStyle = lHalo; ctx.beginPath(); ctx.arc(cx - r*.38, cy + r*.32, r*.60, 0, PI2); ctx.fill()

      const sh = ctx.createRadialGradient(cx + r*.08, cy + r*.12, 0, cx + r*.08, cy + r*.12, r * 1.2)
      sh.addColorStop(0, 'rgba(0,0,8,0.65)'); sh.addColorStop(0.6, 'rgba(0,0,8,0.28)'); sh.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = sh; ctx.beginPath(); ctx.arc(cx + r*.08, cy + r*.12, r*1.2, 0, PI2); ctx.fill()

      // ── 2. SPHERE SURFACE ────────────────────────────────────────────
      ctx.save()
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, PI2); ctx.clip()

      const base = ctx.createRadialGradient(cx - r*.28, cy - r*.30, r*.05, cx, cy, r * 1.05)
      base.addColorStop(0,    'rgba(22, 8, 52, 1)')
      base.addColorStop(0.38, 'rgba(12, 4, 30, 1)')
      base.addColorStop(0.78, 'rgba( 6, 2, 16, 1)')
      base.addColorStop(1,    'rgba( 2, 0,  8, 1)')
      ctx.fillStyle = base; ctx.fillRect(cx-r, cy-r, r*2, r*2)

      const lifeX  = cx + (-0.20 * Math.cos(rot) + 0.16 * Math.sin(rot)) * r
      const lifeY  = cy + ( 0.18 + 0.04 * Math.sin(rot * 0.7)) * r
      const energX = cx + ( 0.28 * Math.cos(rot) - 0.18 * Math.sin(rot)) * r
      const energY = cy + (-0.20 - 0.04 * Math.sin(rot * 0.6)) * r
      const mattX  = cx + (-0.36 * Math.cos(rot) - 0.06 * Math.sin(rot)) * r
      const mattY  = cy + (-0.04 + 0.03 * Math.sin(rot * 0.8)) * r
      const intelX = cx + ( 0.32 * Math.cos(rot) + 0.10 * Math.sin(rot)) * r
      const intelY = cy + ( 0.12 - 0.03 * Math.sin(rot * 0.5)) * r

      ctx.globalCompositeOperation = 'screen'

      // ── LIFE ─────────────────────────────────────────────────────────
      ;[
        [r * .72, 'rgba(16,185,129,0.36)'],
        [r * .42, 'rgba(5,150,105,0.26)'],
        [r * .22, 'rgba(20,184,166,0.22)'],
      ].forEach(([sz, c]) => {
        const g = ctx.createRadialGradient(lifeX, lifeY, 0, lifeX, lifeY, sz)
        g.addColorStop(0, c); g.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = g; ctx.fillRect(cx-r, cy-r, r*2, r*2)
      })
      // DNA double helix
      if (L.dna) {
        const hLen = r * 0.72, hOrig = lifeX - hLen / 2
        const step = Math.max(1.5, r * 0.004)
        for (let i = 0; i <= hLen; i += step) {
          const frac = i / hLen
          const env  = Math.sin(frac * Math.PI)
          const ph   = frac * PI2 * 2.8 + t * 0.00065
          const amp  = r * 0.095
          const x    = hOrig + i
          const y1   = lifeY + Math.sin(ph) * amp
          const y2   = lifeY - Math.sin(ph) * amp
          const op1  = (0.58 * env).toFixed(2)
          const op2  = (0.44 * env).toFixed(2)
          ctx.fillStyle = `rgba(52,211,153,${op1})`
          ctx.beginPath(); ctx.arc(x, y1, 1.0 + env * 0.5, 0, PI2); ctx.fill()
          ctx.fillStyle = `rgba(20,184,166,${op2})`
          ctx.beginPath(); ctx.arc(x, y2, 0.9 + env * 0.4, 0, PI2); ctx.fill()
          if (Math.floor(i / step) % Math.round(13 / step) === 0) {
            ctx.strokeStyle = `rgba(16,185,129,${(0.24*env).toFixed(2)})`
            ctx.lineWidth = 0.6
            ctx.beginPath(); ctx.moveTo(x, y1); ctx.lineTo(x, y2); ctx.stroke()
          }
        }
      }

      // ── ENERGY ───────────────────────────────────────────────────────
      ;[
        [r * .68, 'rgba(251,191,36,0.40)'],
        [r * .40, 'rgba(253,186,116,0.30)'],
        [r * .22, 'rgba(255,215,150,0.22)'],
      ].forEach(([sz, c]) => {
        const g = ctx.createRadialGradient(energX, energY, 0, energX, energY, sz)
        g.addColorStop(0, c); g.addColorStop(0.5, c.slice(0,-4) + '0.10)'); g.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = g; ctx.fillRect(cx-r, cy-r, r*2, r*2)
      })
      {
        const eg = ctx.createRadialGradient(energX + r*.14, energY + r*.08, 0, energX + r*.14, energY + r*.08, r*.30)
        eg.addColorStop(0, 'rgba(56,189,248,0.22)'); eg.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = eg; ctx.fillRect(cx-r, cy-r, r*2, r*2)
      }
      // Lightning arcs
      if (L.lightning) {
        for (let li = 0; li < 4; li++) {
          const ph = t * 0.00082 + li * (PI2 / 4)
          const arm = r * (0.07 + li * 0.055)
          const ax0 = energX + arm * Math.cos(ph)
          const ay0 = energY + arm * Math.sin(ph)
          const ax1 = energX + arm * 1.9 * Math.cos(ph + 1.0 + li * 0.35)
          const ay1 = energY + arm * 1.9 * Math.sin(ph + 1.0 + li * 0.35)
          const mx  = (ax0 + ax1) / 2 + Math.sin(t * 0.0018 + li) * r * 0.055
          const my  = (ay0 + ay1) / 2 + Math.cos(t * 0.0025 + li) * r * 0.055
          ctx.strokeStyle = `rgba(253,224,71,${(0.48 - li * 0.08).toFixed(2)})`
          ctx.lineWidth = 0.9
          ctx.beginPath(); ctx.moveTo(ax0, ay0); ctx.quadraticCurveTo(mx, my, ax1, ay1); ctx.stroke()
        }
      }

      // ── MATTER ───────────────────────────────────────────────────────
      ;[
        [r * .62, 'rgba(91,33,182,0.42)'],
        [r * .36, 'rgba(109,40,217,0.30)'],
        [r * .20, 'rgba(139,92,246,0.22)'],
      ].forEach(([sz, c]) => {
        const g = ctx.createRadialGradient(mattX, mattY, 0, mattX, mattY, sz)
        g.addColorStop(0, c); g.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = g; ctx.fillRect(cx-r, cy-r, r*2, r*2)
      })
      // Hexagonal lattice
      if (L.lattice) {
        const hexR = r * 0.052
        HEXES.forEach(({ nx, ny }) => {
          const hx = mattX + nx * r * 0.95
          const hy = mattY + ny * r * 0.95
          const d  = Math.sqrt((hx - mattX) ** 2 + (hy - mattY) ** 2)
          const prox = Math.max(0, 1 - d / (r * 0.68))
          if (prox < 0.06) return
          ctx.strokeStyle = `rgba(167,139,250,${(0.26 * prox).toFixed(2)})`
          ctx.lineWidth = 0.5
          ctx.beginPath()
          for (let v = 0; v < 6; v++) {
            const va = (v / 6) * PI2 - Math.PI / 6
            const vx = hx + hexR * Math.cos(va), vy = hy + hexR * Math.sin(va)
            v === 0 ? ctx.moveTo(vx, vy) : ctx.lineTo(vx, vy)
          }
          ctx.closePath(); ctx.stroke()
          if (Math.random() < 0.004) {
            ctx.fillStyle = `rgba(216,180,254,${(0.55 * prox).toFixed(2)})`
            ctx.beginPath(); ctx.arc(hx, hy, 1.2, 0, PI2); ctx.fill()
          }
        })
      }

      // ── MOTION ───────────────────────────────────────────────────────
      {
        const mGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * .80)
        mGrad.addColorStop(0,    'rgba(56,189,248,0.12)')
        mGrad.addColorStop(0.5,  'rgba(14,165,233,0.08)')
        mGrad.addColorStop(1,    'rgba(0,0,0,0)')
        ctx.fillStyle = mGrad; ctx.fillRect(cx-r, cy-r, r*2, r*2)
      }
      // Orbital rings
      if (L.rings) {
        RINGS.forEach(({ a, b, tilt, speed, phase }) => {
          const θ  = t * speed + phase
          const rx = a * r, ry = b * r
          ctx.save()
          ctx.translate(cx, cy); ctx.rotate(tilt)
          ctx.strokeStyle = 'rgba(56,189,248,0.18)'
          ctx.lineWidth   = 0.8
          ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, PI2); ctx.stroke()
          ctx.strokeStyle = 'rgba(125,211,252,0.42)'
          ctx.lineWidth   = 1.6
          ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, θ - 0.65, θ); ctx.stroke()
          const dx = rx * Math.cos(θ), dy = ry * Math.sin(θ)
          const dg = ctx.createRadialGradient(dx, dy, 0, dx, dy, r * 0.038)
          dg.addColorStop(0, 'rgba(186,230,253,0.88)'); dg.addColorStop(1, 'rgba(0,0,0,0)')
          ctx.fillStyle = dg; ctx.beginPath(); ctx.arc(dx, dy, r * 0.038, 0, PI2); ctx.fill()
          ctx.restore()
        })
      }

      // ── INTELLIGENCE ─────────────────────────────────────────────────
      ;[
        [r * .58, 'rgba(139,92,246,0.26)'],
        [r * .34, 'rgba(109,40,217,0.20)'],
      ].forEach(([sz, c]) => {
        const g = ctx.createRadialGradient(intelX, intelY, 0, intelX, intelY, sz)
        g.addColorStop(0, c); g.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = g; ctx.fillRect(cx-r, cy-r, r*2, r*2)
      })
      // Circuit traces
      if (L.circuits) {
        CIRCUITS.forEach(({ nx, ny, segs, alpha }) => {
          const tx = intelX + nx * r * 0.72
          const ty = intelY + ny * r * 0.72
          const d  = Math.sqrt((tx - cx) ** 2 + (ty - cy) ** 2)
          if (d > r * 0.92) return
          const fade = (1 - d / r) * alpha
          ctx.strokeStyle = `rgba(192,132,252,${(fade * 2.8).toFixed(2)})`
          ctx.lineWidth = 0.65
          ctx.beginPath(); ctx.moveTo(tx, ty)
          let cx2 = tx, cy2 = ty
          segs.forEach(seg => { cx2 += seg.dx * r * 0.62; cy2 += seg.dy * r * 0.62; ctx.lineTo(cx2, cy2) })
          ctx.stroke()
          ctx.fillStyle = `rgba(216,180,254,${(fade * 4.0).toFixed(2)})`
          ctx.beginPath(); ctx.arc(tx, ty, 1.3, 0, PI2); ctx.fill()
        })
        const nodes = []
        for (let ni = 0; ni < 9; ni++) {
          const nA = (ni / 9) * PI2 + rot * 0.25
          const nD = r * (0.14 + (ni * 0.618 % 0.32))
          const nx2 = intelX + nD * Math.cos(nA)
          const ny2 = intelY + nD * Math.sin(nA)
          if (Math.sqrt((nx2 - cx) ** 2 + (ny2 - cy) ** 2) > r * 0.90) continue
          nodes.push({ x: nx2, y: ny2 })
          ctx.fillStyle = 'rgba(216,180,254,0.50)'
          ctx.beginPath(); ctx.arc(nx2, ny2, 1.6, 0, PI2); ctx.fill()
        }
        nodes.forEach((n, i) => {
          if (i === 0) return
          ctx.strokeStyle = 'rgba(167,139,250,0.18)'
          ctx.lineWidth = 0.5
          ctx.beginPath(); ctx.moveTo(nodes[i-1].x, nodes[i-1].y); ctx.lineTo(n.x, n.y); ctx.stroke()
        })
      }

      // ── PARTICLES ────────────────────────────────────────────────────
      if (L.particles) {
        PARTICLES.forEach(p => {
          p.life += p.speed
          if (p.life > 1) { p.life = 0; p.nx += (Math.random()-.5)*.05; p.ny += (Math.random()-.5)*.04 }
          p.nx = Math.max(-.9, Math.min(.9, p.nx))
          p.ny = Math.max(-.9, Math.min(.9, p.ny))
          const fade = Math.sin(p.life * Math.PI)
          const px = cx + p.nx * r + Math.cos(rot + p.life * PI2) * r * 0.018
          const py = cy + p.ny * r + Math.sin(rot + p.life * PI2) * r * 0.014
          ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${(fade * p.alpha * 0.72).toFixed(2)})`
          ctx.beginPath(); ctx.arc(px, py, p.size, 0, PI2); ctx.fill()
        })
      }

      // ── CENTRE CONVERGENCE GLOW ───────────────────────────────────────
      ;[
        [r*.28, 'rgba(255,255,255,0.08)'],
        [r*.16, 'rgba(220,180,255,0.12)'],
        [r*.08, 'rgba(255,255,255,0.18)'],
      ].forEach(([sz, c]) => {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, sz)
        g.addColorStop(0, c); g.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = g; ctx.fillRect(cx-r, cy-r, r*2, r*2)
      })

      // ── LIMB DARKENING ────────────────────────────────────────────────
      ctx.globalCompositeOperation = 'source-over'
      const limb = ctx.createRadialGradient(cx, cy, r * 0.42, cx, cy, r)
      limb.addColorStop(0,   'rgba(0,0,0,0.00)')
      limb.addColorStop(0.7, 'rgba(0,0,0,0.12)')
      limb.addColorStop(1,   'rgba(0,0,0,0.75)')
      ctx.fillStyle = limb; ctx.fillRect(cx-r, cy-r, r*2, r*2)

      ctx.restore()

      // ── SPECULAR HIGHLIGHT ────────────────────────────────────────────
      ctx.save()
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, PI2); ctx.clip()
      const hlx = cx - r * .32, hly = cy - r * .33
      const hl  = ctx.createRadialGradient(hlx, hly, 0, hlx, hly, r * .42)
      hl.addColorStop(0,   'rgba(255,255,255,0.22)')
      hl.addColorStop(0.5, 'rgba(255,255,255,0.06)')
      hl.addColorStop(1,   'rgba(255,255,255,0.00)')
      ctx.fillStyle = hl; ctx.fillRect(cx-r, cy-r, r*2, r*2)
      ctx.restore()

      // ── RIM LIGHT ─────────────────────────────────────────────────────
      ctx.strokeStyle = 'rgba(139,92,246,0.45)'
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, PI2); ctx.stroke()

      drawFrame.current = requestAnimationFrame(draw)
    }

    document.fonts.ready.then(() => { drawFrame.current = requestAnimationFrame(draw) })

    return () => { cancelAnimationFrame(drawFrame.current); ro.disconnect() }
  }, [])

  return (
    <div className="civ-sphere-root">
      <div
        className="civ-sphere-container"
        ref={containerRef}
        onMouseMove={handleMouseMove}
      >
        <div className="civ-sphere-wrapper" ref={wrapperRef}>
          <div className="civ-sphere-outer-glow" />
          <canvas ref={canvasRef} className="civ-sphere-canvas" />
        </div>
      </div>

      <div className="civ-sphere-controls">
        {LAYER_DEFS.map(({ id, label, color }) => (
          <button
            key={id}
            className={`civ-sphere-toggle ${layers[id] ? 'active' : ''}`}
            style={{ '--layer-color': color }}
            onClick={() => toggleLayer(id)}
          >
            <span className="civ-sphere-toggle-dot" />
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default CivSphere
