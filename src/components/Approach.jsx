import './Approach.css'

const approaches = [
  {
    question: 'WHY?',
    answer: "I invest in companies that build the civilizational pillars of life, matter, motion, intelligence, and energy that are the core foundations for humanity's advancements."
  },
  {
    question: 'WHEN?',
    answer: 'I like to get involved early, often as one of the first believers, when an idea still feels fragile and the data is scarce, but my conviction in the vision is always strong.'
  },
  {
    question: 'HOW?',
    answer: 'I work founder-first and long-term, supporting startups far beyond capital by committing time, network and strategic clarity to help turn bold visions into enduring outcomes.'
  }
]

function Approach() {
  return (
    <section className="approach section">
      <div className="container">
        <div className="approach-content">
          <div className="approach-intro">
            <p className="approach-label">Investment Philosophy</p>
            <h2 className="approach-title">My Approach</h2>
            <p className="approach-description">
              My approach to DeepTech is simple: understand why it matters,
              decide when to back it, and commit to how it will be built.
            </p>
          </div>

          <div className="approach-items">
            {approaches.map((item, index) => (
              <div key={index} className="approach-item">
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
