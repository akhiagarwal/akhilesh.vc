import './InvestmentCard.css'

function InvestmentCard({ investment }) {
  return (
    <a
      href={investment.url}
      target="_blank"
      rel="noopener noreferrer"
      className="investment-card"
    >
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
    </a>
  )
}

export default InvestmentCard
