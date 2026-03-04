import CosmicGame from '../components/CosmicGame'
import Subscribe from '../components/Subscribe'
import './DeliberateFutures.css'

function DeliberateFutures() {
  return (
    <div className="deliberate-futures-page">
      <div className="container">
        <div className="deliberate-futures-hero">
          <h1 className="deliberate-futures-title">DELIBERATE FUTURES</h1>
          <p className="deliberate-futures-subtitle">
            A compendium for founders building hard things.
          </p>
          <p className="deliberate-futures-coming-soon">
            Coming soon
          </p>
          <CosmicGame />
        </div>
      </div>
      <Subscribe />
    </div>
  )
}

export default DeliberateFutures
