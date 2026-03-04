import { useState } from 'react'
import { investments, categories } from '../data/investments'
import InvestmentCard from '../components/InvestmentCard'
import Subscribe from '../components/Subscribe'
import './Portfolio.css'

function Portfolio() {
  const [activeFilter, setActiveFilter] = useState(null)

  const filterInvestments = (investmentList) => {
    if (!activeFilter) return investmentList
    return investmentList.filter((inv) =>
      inv.categories.includes(activeFilter)
    )
  }

  const filteredAngel = filterInvestments(investments.angel)
  const filteredInstitutional = filterInvestments(investments.institutional)

  return (
    <div className="portfolio-page">
      <section className="portfolio-hero">
        <div className="container">
          <h1 className="portfolio-title">ANGEL INVESTMENTS</h1>

          <div className="filter-buttons">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${activeFilter === cat ? 'active' : ''}`}
                onClick={() =>
                  setActiveFilter(activeFilter === cat ? null : cat)
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="portfolio-section">
        <div className="portfolio-grid">
          {filteredAngel.map((investment) => (
            <InvestmentCard key={investment.id} investment={investment} />
          ))}
        </div>
      </section>

      {filteredInstitutional.length > 0 && (
        <>
          <section className="portfolio-hero institutional">
            <div className="container">
              <h2 className="portfolio-title">INSTITUTIONAL INVESTMENTS</h2>
            </div>
          </section>

          <section className="portfolio-section">
            <div className="portfolio-grid">
              {filteredInstitutional.map((investment) => (
                <InvestmentCard key={investment.id} investment={investment} />
              ))}
            </div>
          </section>
        </>
      )}

      <Subscribe />
    </div>
  )
}

export default Portfolio
