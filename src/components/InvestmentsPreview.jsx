import { Link } from 'react-router-dom'
import { investments } from '../data/investments'
import InvestmentCard from './InvestmentCard'
import './InvestmentsPreview.css'

function InvestmentsPreview() {
  const previewInvestments = investments.angel.slice(0, 3)

  return (
    <section className="investments-preview section">
      <div className="container">
        <div className="investments-header">
          <p className="investments-label">Portfolio</p>
          <h2 className="investments-title">Backed by conviction</h2>
        </div>

        <div className="investments-grid">
          {previewInvestments.map((investment) => (
            <InvestmentCard key={investment.id} investment={investment} />
          ))}
        </div>

        <div className="investments-cta">
          <Link to="/portfolio" className="view-all-link">
            View all portfolio companies
          </Link>
        </div>
      </div>
    </section>
  )
}

export default InvestmentsPreview
