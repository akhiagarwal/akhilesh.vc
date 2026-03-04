import { Link, useLocation } from 'react-router-dom'
import './Header.css'

function Header() {
  const location = useLocation()

  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo">
          <span className="logo-text">AKHILESH AGARWAL</span>
        </Link>

        <nav className="nav">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link
            to="/portfolio"
            className={`nav-link ${location.pathname === '/portfolio' ? 'active' : ''}`}
          >
            Portfolio
          </Link>
        </nav>

        <a href="#contact" className="cta-button">
          Get in Touch
          <span className="cta-arrow">&rarr;</span>
        </a>
      </div>
    </header>
  )
}

export default Header
