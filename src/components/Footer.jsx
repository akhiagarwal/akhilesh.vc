import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="footer-logo-circle">
                <span>A</span>
              </div>
              <span className="footer-logo-text">AKHILESH AGARWAL</span>
            </div>
            <p className="footer-tagline">
              Early-stage DeepTech investor backing founders at the frontiers of science & engineering.
            </p>
          </div>

          <nav className="footer-nav">
            <h4 className="footer-nav-title">Pages</h4>
            <Link to="/">Home</Link>
            <Link to="/portfolio">Portfolio</Link>
          </nav>

          <div className="footer-social">
            <h4 className="footer-nav-title">Connect</h4>
            <a href="mailto:hello@akhilesh.vc">Email</a>
            <a href="https://x.com/akhi_agarwal" target="_blank" rel="noopener noreferrer">Twitter / X</a>
            <a href="https://www.linkedin.com/in/akhiagarwal/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://www.instagram.com/akhilesh.agarwal.vc/" target="_blank" rel="noopener noreferrer">Instagram</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">&copy; 2025 Akhilesh Agarwal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
