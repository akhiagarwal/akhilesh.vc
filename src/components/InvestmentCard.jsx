import './InvestmentCard.css'

function InvestmentCard({ investment }) {
  return (
    <div className="investment-card">
      <div className="card-header">
        <div className="card-logo">{investment.logo}</div>
      </div>
      <div className="card-image">
        <img src={investment.image} alt={investment.name} />
      </div>
      <div className="card-body">
        <p className="card-description">{investment.description}</p>
        <div className="card-categories">
          <span className="card-category">
            {investment.categories.join(' / ')}
          </span>
        </div>
      </div>
    </div>
  )
}

export default InvestmentCard
