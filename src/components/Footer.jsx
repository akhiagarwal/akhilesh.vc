import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-logo">
            <span className="logo-icon">✴</span>
            <span className="logo-text">AKHILESH AGARWAL</span>
          </div>

          <nav className="footer-nav">
            <Link to="/">HOME</Link>
            <Link to="/portfolio">PORTFOLIO</Link>
          </nav>

          <div className="footer-social">
            <a href="mailto:hello@akhilesh.vc">
              EMAIL
            </a>
            <a href="https://x.com/akhi_agarwal" target="_blank" rel="noopener noreferrer">
              TWITTER
            </a>
            <a href="https://www.instagram.com/akhilesh.agarwal.vc/" target="_blank" rel="noopener noreferrer">
              INSTAGRAM
            </a>
            <a href="https://www.linkedin.com/in/akhiagarwal/" target="_blank" rel="noopener noreferrer">
              LINKEDIN
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">© 2025 ALL RIGHTS RESERVED</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
