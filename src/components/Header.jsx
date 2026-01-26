import { Link, useLocation } from 'react-router-dom'
import './Header.css'

function Header() {
  const location = useLocation()

  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">✴</span>
          <span className="logo-text">AKHILESH AGARWAL</span>
        </Link>

        <nav className="nav">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            HOME
          </Link>
          <Link
            to="/portfolio"
            className={`nav-link ${location.pathname === '/portfolio' ? 'active' : ''}`}
          >
            PORTFOLIO
          </Link>
        </nav>

        <a href="#contact" className="cta-button">
          LET'S TALK
          <span className="cta-icon">⊕</span>
        </a>
      </div>
    </header>
  )
}

export default Header
