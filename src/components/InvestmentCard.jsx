import './InvestmentCard.css'

function InvestmentCard({ investment }) {
  return (
    <div className="investment-card">
      <div className="card-logo">{investment.logo}</div>
      <div className="card-image">
        <img src={investment.image} alt={investment.name} />
      </div>
      <p className="card-description">{investment.description}</p>
      <div className="card-categories">
        {investment.categories.map((cat, index) => (
          <span key={index} className="card-category">
            {cat}
          </span>
        ))}
      </div>
    </div>
  )
}

export default InvestmentCard
