import { useState, useEffect, useRef, useCallback } from 'react'
import './EclipseGame.css'

const ARENA_WIDTH = 360
const ARENA_HEIGHT = 240
const ENTITY_SIZE = 22
const BH_SPEED = 0.022

function EclipseGame() {
  const [active, setActive] = useState(false)
  const [sun, setSun] = useState({ x: 40, y: ARENA_HEIGHT / 2 })
  const [moon, setMoon] = useState({ x: ARENA_WIDTH - 40, y: ARENA_HEIGHT / 2 })
  const [bh, setBh] = useState({ x: ARENA_WIDTH / 2, y: ARENA_HEIGHT / 2 })
  const [gameState, setGameState] = useState('playing')
  const [loser, setLoser] = useState(null)
  const [dragging, setDragging] = useState(null)

  const sunRef = useRef(sun)
  const moonRef = useRef(moon)
  const bhRef = useRef(bh)
  const bhTargetRef = useRef(Math.random() > 0.5 ? 'sun' : 'moon')
  const frameRef = useRef(null)
  const lastTimeRef = useRef(null)
  const arenaRef = useRef(null)
  const switchTimerRef = useRef(0)

  sunRef.current = sun
  moonRef.current = moon
  bhRef.current = bh

  const reset = useCallback(() => {
    setSun({ x: 40, y: ARENA_HEIGHT / 2 })
    setMoon({ x: ARENA_WIDTH - 40, y: ARENA_HEIGHT / 2 })
    setBh({ x: ARENA_WIDTH / 2, y: ARENA_HEIGHT / 2 })
    setGameState('playing')
    setLoser(null)
    setDragging(null)
    bhTargetRef.current = Math.random() > 0.5 ? 'sun' : 'moon'
    lastTimeRef.current = null
    switchTimerRef.current = 0
  }, [])

  const activate = useCallback(() => {
    if (!active) {
      setActive(true)
      reset()
    }
  }, [active, reset])

  // Game loop
  useEffect(() => {
    if (!active || gameState !== 'playing') return

    const animate = (time) => {
      if (!lastTimeRef.current) lastTimeRef.current = time
      const dt = Math.min(time - lastTimeRef.current, 32)
      lastTimeRef.current = time

      const s = sunRef.current
      const m = moonRef.current
      const b = bhRef.current

      switchTimerRef.current += dt
      if (switchTimerRef.current > 1800 + Math.random() * 2200) {
        bhTargetRef.current = bhTargetRef.current === 'sun' ? 'moon' : 'sun'
        switchTimerRef.current = 0
      }

      const target = bhTargetRef.current === 'sun' ? s : m
      const dx = target.x - b.x
      const dy = target.y - b.y
      const dist = Math.sqrt(dx * dx + dy * dy) || 1
      const newBhX = b.x + (dx / dist) * BH_SPEED * dt
      const newBhY = b.y + (dy / dist) * BH_SPEED * dt
      const clampedBhX = Math.max(ENTITY_SIZE / 2, Math.min(ARENA_WIDTH - ENTITY_SIZE / 2, newBhX))
      const clampedBhY = Math.max(ENTITY_SIZE / 2, Math.min(ARENA_HEIGHT - ENTITY_SIZE / 2, newBhY))

      // Win: sun and moon meet
      const smDist = Math.sqrt((s.x - m.x) ** 2 + (s.y - m.y) ** 2)
      if (smDist < ENTITY_SIZE * 0.9) {
        setGameState('won')
        return
      }

      // Loss: black hole catches one
      const bsDist = Math.sqrt((clampedBhX - s.x) ** 2 + (clampedBhY - s.y) ** 2)
      if (bsDist < ENTITY_SIZE * 0.75) {
        setBh({ x: clampedBhX, y: clampedBhY })
        setLoser('sun')
        setGameState('lost')
        return
      }
      const bmDist = Math.sqrt((clampedBhX - m.x) ** 2 + (clampedBhY - m.y) ** 2)
      if (bmDist < ENTITY_SIZE * 0.75) {
        setBh({ x: clampedBhX, y: clampedBhY })
        setLoser('moon')
        setGameState('lost')
        return
      }

      setBh({ x: clampedBhX, y: clampedBhY })
      frameRef.current = requestAnimationFrame(animate)
    }

    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [active, gameState])

  const getArenaPos = useCallback((clientX, clientY) => {
    if (!arenaRef.current) return { x: 0, y: 0 }
    const rect = arenaRef.current.getBoundingClientRect()
    return {
      x: Math.max(ENTITY_SIZE / 2, Math.min(ARENA_WIDTH - ENTITY_SIZE / 2, clientX - rect.left)),
      y: Math.max(ENTITY_SIZE / 2, Math.min(ARENA_HEIGHT - ENTITY_SIZE / 2, clientY - rect.top))
    }
  }, [])

  const handlePointerDown = useCallback((entity, e) => {
    if (gameState !== 'playing') return
    e.preventDefault()
    e.stopPropagation()
    setDragging(entity)
  }, [gameState])

  useEffect(() => {
    if (!dragging) return

    const handleMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      const clientY = e.touches ? e.touches[0].clientY : e.clientY
      const pos = getArenaPos(clientX, clientY)
      if (dragging === 'sun') setSun(pos)
      else setMoon(pos)
    }

    const handleUp = () => setDragging(null)

    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)
    window.addEventListener('touchmove', handleMove, { passive: false })
    window.addEventListener('touchend', handleUp)

    return () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
      window.removeEventListener('touchmove', handleMove)
      window.removeEventListener('touchend', handleUp)
    }
  }, [dragging, getArenaPos])

  if (!active) {
    return (
      <div className="eclipse-game-wrapper">
        <button className="eclipse-start" onClick={activate}>
          <img src="/images/game-sun.png" alt="sun" className="eclipse-start-img" />
          <img src="/images/game-blackhole.png" alt="black hole" className="eclipse-start-img" />
          <img src="/images/game-moon.png" alt="moon" className="eclipse-start-img" />
        </button>
      </div>
    )
  }

  return (
    <>
    <div className="eclipse-overlay" onClick={() => setActive(false)} />
    <div className="eclipse-game-wrapper active" onClick={() => setActive(false)}>
      <div
        className={`eclipse-arena ${gameState !== 'playing' ? 'game-over' : ''}`}
        style={{ width: ARENA_WIDTH, height: ARENA_HEIGHT }}
        ref={arenaRef}
        onClick={(e) => { e.stopPropagation(); if (gameState !== 'playing') reset(); }}
      >
        {/* Stars background */}
        <div className="arena-stars" />
        <div className="arena-nebula" />

        <img
          src={gameState === 'won' ? '/images/game-sun.png' : gameState === 'lost' && loser === 'sun' ? '/images/game-blackhole.png' : '/images/game-sun.png'}
          alt="sun"
          className={`eclipse-entity eclipse-sun ${dragging === 'sun' ? 'dragging' : ''} ${gameState === 'lost' && loser === 'sun' ? 'caught' : ''}`}
          style={{ left: sun.x, top: sun.y, width: ENTITY_SIZE, height: ENTITY_SIZE }}
          onPointerDown={(e) => handlePointerDown('sun', e)}
        />
        <img
          src="/images/game-blackhole.png"
          alt="black hole"
          className={`eclipse-entity eclipse-bh ${gameState === 'lost' ? 'caught' : ''}`}
          style={{ left: bh.x, top: bh.y, width: ENTITY_SIZE, height: ENTITY_SIZE }}
        />
        <img
          src={gameState === 'won' ? '/images/game-moon.png' : gameState === 'lost' && loser === 'moon' ? '/images/game-blackhole.png' : '/images/game-moon.png'}
          alt="moon"
          className={`eclipse-entity eclipse-moon ${dragging === 'moon' ? 'dragging' : ''} ${gameState === 'lost' && loser === 'moon' ? 'caught' : ''}`}
          style={{ left: moon.x, top: moon.y, width: ENTITY_SIZE, height: ENTITY_SIZE }}
          onPointerDown={(e) => handlePointerDown('moon', e)}
        />

        {gameState !== 'playing' && (
          <span className="eclipse-status">
            {gameState === 'won' ? '✨' : '💔'}
          </span>
        )}
      </div>
      <div className="eclipse-bar" onClick={(e) => e.stopPropagation()}>
        {gameState !== 'playing' ? (
          <span className="eclipse-replay" onClick={reset}>replay</span>
        ) : (
          <span className="eclipse-hint">drag sun and moon together — avoid the black hole</span>
        )}
      </div>
    </div>
    </>
  )
}

export default EclipseGame
