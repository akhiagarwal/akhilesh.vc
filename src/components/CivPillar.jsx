import { useEffect, useRef, useState, useCallback } from 'react'
import './CivPillar.css'

const PI2 = Math.PI * 2

// ─── Geometry (identical to CivCloud) ────────────────────────────────────────

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
  { a: 0.62, b: 0.22, tilt: 0.42,  speed: 0.00018, phase: 0.0  },
  { a: 0.78, b: 0.18, tilt: -0.28, speed: 0.00011, phase: 2.09 },
  { a: 0.48, b: 0.28, tilt: 0.85,  speed: 0.00024, phase: 4.19 },
]

const PARTICLES = [
  ...Array.from({ length: 32 }, () => ({ nx: -0.24 + (Math.random()-0.5)*0.92, ny: 0.22 + (Math.random()-0.5)*0.86, life: Math.random(), speed: 0.0022+Math.random()*0.002, size: 0.8+Math.random()*1.8, alpha: 0.32+Math.random()*0.48, r:52,  g:211, b:153 })),
  ...Array.from({ length: 30 }, () => ({ nx:  0.32 + (Math.random()-0.5)*0.86, ny:-0.24 + (Math.random()-0.5)*0.80, life: Math.random(), speed: 0.0028+Math.random()*0.002, size: 0.7+Math.random()*2.0, alpha: 0.36+Math.random()*0.48, r:253, g:186, b:116 })),
  ...Array.from({ length: 24 }, () => ({ nx: -0.44 + (Math.random()-0.5)*0.78, ny:-0.05 + (Math.random()-0.5)*0.78, life: Math.random(), speed: 0.0018+Math.random()*0.002, size: 0.6+Math.random()*1.6, alpha: 0.28+Math.random()*0.42, r:167, g:139, b:250 })),
  ...Array.from({ length: 24 }, () => ({ nx:  0.36 + (Math.random()-0.5)*0.76, ny: 0.12 + (Math.random()-0.5)*0.76, life: Math.random(), speed: 0.0020+Math.random()*0.002, size: 0.5+Math.random()*1.5, alpha: 0.28+Math.random()*0.42, r:192, g:132, b:252 })),
  ...Array.from({ length: 22 }, () => ({ nx: (Math.random()-0.5)*1.30,         ny:(Math.random()-0.5)*0.55,         life: Math.random(), speed: 0.0032+Math.random()*0.002, size: 0.5+Math.random()*1.2, alpha: 0.24+Math.random()*0.36, r:125, g:211, b:252 })),
]

// ─── Pillar label data ────────────────────────────────────────────────────────
// Positions correspond to each pillar cloud's quadrant (r = 0.46 × canvas size).
// tipPos controls where the tooltip appears relative to the label anchor.

export const PILLARS = [
  {
    id: 'matter',
    label: 'MATTER',
    color: '#a78bfa',
    pos: { left: '14%', top: '38%' },
    desc: 'Mastery of materials and manufacturing. From quantum chips to nanomaterials, this pillar reshapes what we can build, laying the backbone of tomorrow\'s industries and tools.',
  },
  {
    id: 'life',
    label: 'LIFE',
    color: '#34d399',
    pos: { left: '26%', top: '70%' },
    desc: 'Extending and enriching life through biotech, medicine, food, and biodiversity. From curing disease to feeding the planet, this pillar preserves and advances human flourishing.',
  },
  {
    id: 'motion',
    label: 'MOTION',
    color: '#7dd3fc',
    pos: { left: '47%', top: '28%' },
    desc: 'The ability to move, explore, and connect. Aerospace, rockets, satellites, next-gen transport, and robotics. Motion transcends distance; from hyperloops on Earth to colonies beyond it.',
  },
  {
    id: 'energy',
    label: 'ENERGY',
    color: '#fbbf24',
    pos: { left: '72%', top: '42%' },
    desc: 'Clean, abundant, and reliable energy. Fusion, advanced nuclear, batteries, and grids to power civilization\'s growth without harming the planet. The engine of sustainable progress.',
  },
  {
    id: 'intelligence',
    label: 'INTELLIGENCE',
    color: '#c084fc',
    pos: { left: '68%', top: '68%' },
    desc: 'Amplifying the mind\'s reach. AI, computing, data, and human-machine interfaces. Intelligence enables smarter decisions, creativity, and connectedness across civilization.',
  },
]

// Display order for tooltip row (left → right)
export const TOOLTIP_ORDER = ['life', 'matter', 'motion', 'intelligence', 'energy']

// ─────────────────────────────────────────────────────────────────────────────

function CivPillar({ onPillarHover }) {
  const canvasRef    = useRef(null)
  const containerRef = useRef(null)
  const wrapperRef   = useRef(null)
  const tiltFrame    = useRef(null)
  const drawFrame    = useRef(null)
  const target       = useRef({ x: -18, y: -10 })
  const current      = useRef({ x: -18, y: -10 })
  const isIdle       = useRef(true)
  const idleTimer    = useRef(null)
  const [isMobile, setIsMobile] = useState(false)
  const [hovered, setHovered]   = useState(null)
  const [vibrating, setVibrating] = useState(null)

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
      x: ((e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2)) * 10,
      y: ((e.clientY - rect.top  - rect.height / 2) / (rect.height / 2)) * 6 + 3,
    }
    idleTimer.current = setTimeout(() => { isIdle.current = true }, 2200)
  }, [isMobile])

  useEffect(() => {
    if (isMobile) return
    const tick = (t) => {
      if (isIdle.current) {
        target.current = { x: Math.sin(t * 0.00038) * 6, y: Math.cos(t * 0.00025) * 3 + 3 }
      }
      current.current.x += (target.current.x - current.current.x) * 0.038
      current.current.y += (target.current.y - current.current.y) * 0.038
      if (wrapperRef.current)
        wrapperRef.current.style.transform =
          `rotateY(${current.current.x}deg) rotateX(${-current.current.y}deg)`
      tiltFrame.current = requestAnimationFrame(tick)
    }
    tiltFrame.current = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(tiltFrame.current); clearTimeout(idleTimer.current) }
  }, [isMobile])

  // ─── Canvas render loop (identical to CivCloud) ───────────────────────────
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

    const radFill = (gx, gy, r0, r1, stops) => {
      const g = ctx.createRadialGradient(gx, gy, r0, gx, gy, r1)
      stops.forEach(([pos, color]) => g.addColorStop(pos, color))
      ctx.fillStyle = g
      ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr)
    }

    const draw = (t) => {
      const S   = canvas.width / dpr
      const cx  = S / 2, cy = S / 2
      const r   = S * 0.46
      const rot = t * 0.000085

      ctx.clearRect(0, 0, S, S)

      const lifeX  = cx + (-0.28 * Math.cos(rot) + 0.18 * Math.sin(rot)) * r
      const lifeY  = cy + ( 0.26 + 0.06 * Math.sin(rot * 0.7)) * r
      const energX = cx + ( 0.38 * Math.cos(rot) - 0.20 * Math.sin(rot)) * r
      const energY = cy + (-0.28 - 0.06 * Math.sin(rot * 0.6)) * r
      const mattX  = cx + (-0.48 * Math.cos(rot) - 0.09 * Math.sin(rot)) * r
      const mattY  = cy + (-0.06 + 0.05 * Math.sin(rot * 0.8)) * r
      const intelX = cx + ( 0.44 * Math.cos(rot) + 0.14 * Math.sin(rot)) * r
      const intelY = cy + ( 0.16 - 0.05 * Math.sin(rot * 0.5)) * r

      ctx.globalCompositeOperation = 'screen'

      // LIFE
      ;[[r*1.55,'rgba(16,185,129,0.26)'],[r*0.90,'rgba(5,150,105,0.20)'],[r*0.46,'rgba(20,184,166,0.18)']].forEach(([sz,c])=>radFill(lifeX,lifeY,0,sz,[[0,c],[1,'rgba(0,0,0,0)']]))
      {
        const hLen = r * 1.20, hOrig = lifeX - hLen / 2, step = Math.max(1.5, r * 0.004)
        for (let i = 0; i <= hLen; i += step) {
          const frac = i/hLen, env = Math.sin(frac*Math.PI), ph = frac*PI2*2.8 + t*0.00065
          const amp = r*0.10, x = hOrig+i, y1 = lifeY+Math.sin(ph)*amp, y2 = lifeY-Math.sin(ph)*amp
          ctx.fillStyle = `rgba(52,211,153,${(0.52*env).toFixed(2)})`; ctx.beginPath(); ctx.arc(x,y1,1.1+env*0.5,0,PI2); ctx.fill()
          ctx.fillStyle = `rgba(20,184,166,${(0.40*env).toFixed(2)})`; ctx.beginPath(); ctx.arc(x,y2,1.0+env*0.4,0,PI2); ctx.fill()
          if (Math.floor(i/step)%Math.round(13/step)===0) { ctx.strokeStyle=`rgba(16,185,129,${(0.22*env).toFixed(2)})`; ctx.lineWidth=0.6; ctx.beginPath(); ctx.moveTo(x,y1); ctx.lineTo(x,y2); ctx.stroke() }
        }
      }

      // ENERGY
      ;[[r*1.48,'rgba(251,191,36,0.30)'],[r*0.86,'rgba(253,186,116,0.24)'],[r*0.44,'rgba(255,215,150,0.18)']].forEach(([sz,c])=>{
        const g=ctx.createRadialGradient(energX,energY,0,energX,energY,sz); g.addColorStop(0,c); g.addColorStop(0.5,c.slice(0,-4)+'0.08)'); g.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=g; ctx.fillRect(0,0,S,S)
      })
      radFill(energX+r*.18,energY+r*.11,0,r*.55,[[0,'rgba(56,189,248,0.18)'],[1,'rgba(0,0,0,0)']])
      for (let li=0;li<4;li++){
        const ph=t*0.00082+li*(PI2/4), arm=r*(0.08+li*0.060)
        const ax0=energX+arm*Math.cos(ph), ay0=energY+arm*Math.sin(ph)
        const ax1=energX+arm*2.0*Math.cos(ph+1.0+li*0.35), ay1=energY+arm*2.0*Math.sin(ph+1.0+li*0.35)
        const mx=(ax0+ax1)/2+Math.sin(t*0.0018+li)*r*0.06, my=(ay0+ay1)/2+Math.cos(t*0.0025+li)*r*0.06
        ctx.strokeStyle=`rgba(253,224,71,${(0.44-li*0.08).toFixed(2)})`; ctx.lineWidth=0.9; ctx.beginPath(); ctx.moveTo(ax0,ay0); ctx.quadraticCurveTo(mx,my,ax1,ay1); ctx.stroke()
      }

      // MATTER
      ;[[r*1.36,'rgba(91,33,182,0.34)'],[r*0.78,'rgba(109,40,217,0.24)'],[r*0.42,'rgba(139,92,246,0.18)']].forEach(([sz,c])=>radFill(mattX,mattY,0,sz,[[0,c],[1,'rgba(0,0,0,0)']]))
      const hexR=r*0.062
      HEXES.forEach(({nx,ny})=>{
        const hx=mattX+nx*r*1.40, hy=mattY+ny*r*1.40, d=Math.sqrt((hx-mattX)**2+(hy-mattY)**2), prox=Math.max(0,1-d/(r*1.00))
        if(prox<0.06) return
        ctx.strokeStyle=`rgba(167,139,250,${(0.24*prox).toFixed(2)})`; ctx.lineWidth=0.5; ctx.beginPath()
        for(let v=0;v<6;v++){const va=(v/6)*PI2-Math.PI/6; v===0?ctx.moveTo(hx+hexR*Math.cos(va),hy+hexR*Math.sin(va)):ctx.lineTo(hx+hexR*Math.cos(va),hy+hexR*Math.sin(va))}
        ctx.closePath(); ctx.stroke()
        if(Math.random()<0.004){ctx.fillStyle=`rgba(216,180,254,${(0.50*prox).toFixed(2)})`; ctx.beginPath(); ctx.arc(hx,hy,1.2,0,PI2); ctx.fill()}
      })

      // MOTION
      radFill(cx,cy,0,r*1.60,[[0,'rgba(56,189,248,0.09)'],[0.5,'rgba(14,165,233,0.05)'],[1,'rgba(0,0,0,0)']])
      RINGS.forEach(({a,b,tilt,speed,phase})=>{
        const θ=t*speed+phase, rx=a*r, ry=b*r
        ctx.save(); ctx.translate(cx,cy); ctx.rotate(tilt)
        ctx.strokeStyle='rgba(56,189,248,0.15)'; ctx.lineWidth=0.8; ctx.beginPath(); ctx.ellipse(0,0,rx,ry,0,0,PI2); ctx.stroke()
        ctx.strokeStyle='rgba(125,211,252,0.38)'; ctx.lineWidth=1.6; ctx.beginPath(); ctx.ellipse(0,0,rx,ry,0,θ-0.65,θ); ctx.stroke()
        const dx=rx*Math.cos(θ),dy=ry*Math.sin(θ),dg=ctx.createRadialGradient(dx,dy,0,dx,dy,r*0.040)
        dg.addColorStop(0,'rgba(186,230,253,0.85)'); dg.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=dg; ctx.beginPath(); ctx.arc(dx,dy,r*0.040,0,PI2); ctx.fill()
        ctx.restore()
      })

      // INTELLIGENCE
      ;[[r*1.26,'rgba(139,92,246,0.20)'],[r*0.72,'rgba(109,40,217,0.16)']].forEach(([sz,c])=>radFill(intelX,intelY,0,sz,[[0,c],[1,'rgba(0,0,0,0)']]))
      CIRCUITS.forEach(({nx,ny,segs,alpha})=>{
        const tx=intelX+nx*r*1.05, ty=intelY+ny*r*1.05, d=Math.sqrt((tx-cx)**2+(ty-cy)**2)
        if(d>r*1.40) return
        const fade=Math.max(0,1-d/(r*1.45))*alpha
        ctx.strokeStyle=`rgba(192,132,252,${(fade*2.6).toFixed(2)})`; ctx.lineWidth=0.65; ctx.beginPath(); ctx.moveTo(tx,ty)
        let cx2=tx, cy2=ty; segs.forEach(seg=>{cx2+=seg.dx*r*0.85; cy2+=seg.dy*r*0.85; ctx.lineTo(cx2,cy2)}); ctx.stroke()
        ctx.fillStyle=`rgba(216,180,254,${(fade*3.8).toFixed(2)})`; ctx.beginPath(); ctx.arc(tx,ty,1.3,0,PI2); ctx.fill()
      })
      const nodes=[]
      for(let ni=0;ni<9;ni++){
        const nA=(ni/9)*PI2+rot*0.25, nD=r*(0.20+(ni*0.618%0.45))
        const nx2=intelX+nD*Math.cos(nA), ny2=intelY+nD*Math.sin(nA)
        nodes.push({x:nx2,y:ny2}); ctx.fillStyle='rgba(216,180,254,0.45)'; ctx.beginPath(); ctx.arc(nx2,ny2,1.6,0,PI2); ctx.fill()
      }
      nodes.forEach((n,i)=>{if(i===0)return; ctx.strokeStyle='rgba(167,139,250,0.15)'; ctx.lineWidth=0.5; ctx.beginPath(); ctx.moveTo(nodes[i-1].x,nodes[i-1].y); ctx.lineTo(n.x,n.y); ctx.stroke()})

      // PARTICLES
      PARTICLES.forEach(p=>{
        p.life+=p.speed
        if(p.life>1){p.life=0; p.nx+=(Math.random()-.5)*.06; p.ny+=(Math.random()-.5)*.05}
        p.nx=Math.max(-1.4,Math.min(1.4,p.nx)); p.ny=Math.max(-1.4,Math.min(1.4,p.ny))
        const fade=Math.sin(p.life*Math.PI), px=cx+p.nx*r+Math.cos(rot+p.life*PI2)*r*0.022, py=cy+p.ny*r+Math.sin(rot+p.life*PI2)*r*0.016
        ctx.fillStyle=`rgba(${p.r},${p.g},${p.b},${(fade*p.alpha*0.68).toFixed(2)})`; ctx.beginPath(); ctx.arc(px,py,p.size,0,PI2); ctx.fill()
      })

      // CENTRE CONVERGENCE
      ;[[r*.50,'rgba(255,255,255,0.07)'],[r*.28,'rgba(220,180,255,0.11)'],[r*.13,'rgba(255,255,255,0.16)']].forEach(([sz,c])=>radFill(cx,cy,0,sz,[[0,c],[1,'rgba(0,0,0,0)']]))

      // VIGNETTE
      ctx.globalCompositeOperation='destination-in'
      const vignette=ctx.createRadialGradient(cx,cy,r*0.62,cx,cy,r*1.04)
      vignette.addColorStop(0,'rgba(0,0,0,1)'); vignette.addColorStop(1,'rgba(0,0,0,0)')
      ctx.fillStyle=vignette; ctx.fillRect(0,0,S,S)
      ctx.globalCompositeOperation='source-over'

      drawFrame.current = requestAnimationFrame(draw)
    }

    document.fonts.ready.then(() => { drawFrame.current = requestAnimationFrame(draw) })
    return () => { cancelAnimationFrame(drawFrame.current); ro.disconnect() }
  }, [])

  return (
    <div
      className="civ-pillar-container"
      ref={containerRef}
      onMouseMove={handleMouseMove}
    >
      <div className="civ-pillar-wrapper" ref={wrapperRef}>
        <canvas ref={canvasRef} className="civ-pillar-canvas" style={{ pointerEvents: 'none' }} />

        {PILLARS.map(p => (
          <div
            key={p.id}
            className={`cp-label ${hovered === p.id ? 'cp-label--active' : ''} ${vibrating === p.id ? 'cp-label--vibrating' : ''}`}
            style={{ left: p.pos.left, top: p.pos.top, '--c': p.color }}
            onMouseEnter={() => { setHovered(p.id); onPillarHover?.(p.id) }}
            onMouseLeave={() => { setHovered(null); onPillarHover?.(null) }}
            onClick={() => { setVibrating(p.id); setTimeout(() => setVibrating(null), 1800) }}
          >
            <div className="cp-tag">
              <span className="cp-dot" />
              <span className="cp-name">{p.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CivPillar
