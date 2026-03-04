import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Header.css'

function Header() {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="header-container">
        <nav className="nav">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>

          <span className="header-divider" />

          <Link
            to="/portfolio"
            className={`nav-link ${location.pathname === '/portfolio' ? 'active' : ''}`}
          >
            Portfolio
          </Link>

          <span className="header-divider" />

          <Link
            to="/deliberate-futures"
            className={`nav-link ${location.pathname === '/deliberate-futures' ? 'active' : ''}`}
          >
            Book
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
