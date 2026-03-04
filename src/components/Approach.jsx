import './Approach.css'

const approaches = [
  {
    num: '01',
    question: 'WHY',
    answer: "I invest in companies building the civilizational pillars of life, matter, motion, intelligence, and energy — the core foundations of humanity's advancement."
  },
  {
    num: '02',
    question: 'WHEN',
    answer: 'I get involved early, often as one of the first believers, when an idea still feels fragile and data is scarce — but conviction in the vision is always strong.'
  },
  {
    num: '03',
    question: 'HOW',
    answer: 'Founder-first and long-term. I support startups far beyond capital — committing time, network and strategic clarity to help turn bold visions into enduring outcomes.'
  }
]

function Approach() {
  return (
    <section className="approach section">
      <div className="container">
        <div className="approach-content">
          <div className="approach-intro">
            <span className="approach-label">My Approach</span>
          </div>

          <div className="approach-items">
            {approaches.map((item, i) => (
              <div key={i} className="approach-item">
                <h3 className="approach-question">{item.question}</h3>
                <p className="approach-answer">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Approach
