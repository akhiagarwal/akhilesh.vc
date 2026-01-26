import { Link } from 'react-router-dom'
import { investments } from '../data/investments'
import InvestmentCard from './InvestmentCard'
import './InvestmentsPreview.css'

function InvestmentsPreview() {
  const previewInvestments = investments.angel.slice(0, 3)

  return (
    <section className="investments-preview section">
      <div className="container">
        <h2 className="investments-title">MY INVESTMENTS</h2>

        <div className="investments-grid">
          {previewInvestments.map((investment) => (
            <InvestmentCard key={investment.id} investment={investment} />
          ))}
        </div>

        <div className="investments-cta">
          <Link to="/portfolio" className="view-all-link">
            VIEW ALL PORTFOLIO COMPANIES
          </Link>
        </div>
      </div>
    </section>
  )
}

export default InvestmentsPreview
