import Hero from '../components/Hero'
import About from '../components/About'
import InvestmentsPreview from '../components/InvestmentsPreview'
import CTA from '../components/CTA'
import Subscribe from '../components/Subscribe'

function Home() {
  return (
    <>
      <Hero />
      <div className="section-separator">
        <span className="section-separator-line" />
        <span className="section-separator-label">About</span>
        <span className="section-separator-line" />
      </div>
      <About />
      <InvestmentsPreview />
      <CTA />
      <Subscribe />
    </>
  )
}

export default Home
