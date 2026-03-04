import './CTA.css'

function CTA() {
  return (
    <section className="cta section" id="contact">
      <div className="cta-glow"></div>
      <div className="container cta-container">
        <p className="cta-label">Let's Connect</p>
        <h2 className="cta-title">
          Building something at the intersection of core science and engineering?
        </h2>
        <p className="cta-subtitle">
          I believe in deploying my capital towards helping shape deliberate
          futures for our species.
        </p>
        <a href="mailto:hello@akhilesh.vc" className="cta-action">
          Get in Touch
          <span>&rarr;</span>
        </a>
      </div>
    </section>
  )
}

export default CTA
