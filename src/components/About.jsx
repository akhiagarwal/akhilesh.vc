import { useEffect, useRef, useState } from 'react'
import './About.css'

const paragraph1 = "I am Akhilesh Agarwal, an early-stage investor, focused on investing in civilizational pillars of Life, Matter, Motion, Intelligence, and Energy. I partner with ambitious founders building at the frontiers of science & engineering - from Space and BioTech to Advanced Materials, Robotics, and beyond."

const paragraph2 = "My approach is founder first and long term, often investing when ideas are still fragile. For me, supporting startups goes far beyond capital. I believe in deploying my capital and time towards shaping deliberate futures for our species and strengthening the foundations of civilization."

const allWords = [...paragraph1.split(' '), '\n', ...paragraph2.split(' ')]

function About() {
  const textRef = useRef(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!textRef.current) return
      const rect = textRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      // Start highlighting when section enters viewport, finish when it's centered
      const start = windowHeight * 0.85
      const end = windowHeight * 0.15
      const raw = (start - rect.top) / (start - end)
      setProgress(Math.min(1, Math.max(0, raw)))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const totalWords = allWords.filter(w => w !== '\n').length
  const highlightedCount = Math.floor(progress * totalWords)

  let wordIndex = 0

  return (
    <section className="about section">
      <div className="container">
        <div className="about-content">
          <div className="about-image">
            <img
              src="/images/akhilesh.jpg"
              alt="Akhilesh Agarwal"
            />
          </div>

          <div className="about-text" ref={textRef}>
            {[paragraph1, paragraph2].map((para, pIdx) => (
              <p key={pIdx}>
                {para.split(' ').map((word, wIdx) => {
                  const currentIndex = wordIndex++
                  const isHighlighted = currentIndex < highlightedCount
                  return (
                    <span
                      key={wIdx}
                      className={`scroll-word ${isHighlighted ? 'highlighted' : ''}`}
                    >
                      {word}{' '}
                    </span>
                  )
                })}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
