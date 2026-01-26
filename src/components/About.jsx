import './About.css'

function About() {
  return (
    <section className="about section">
      <div className="container">
        <h2 className="section-title">ABOUT ME</h2>

        <div className="about-content">
          <div className="about-image">
            <img
              src="/images/akhilesh.jpg"
              alt="Akhilesh Agarwal"
            />
          </div>

          <div className="about-text">
            <p>
              I am Akhilesh Agarwal, an early-stage DeepTech investor, focused on
              investing in civilizational pillars of Life, Matter, Motion,
              Intelligence, and Energy. I partner with ambitious founders building
              at the frontiers of science & engineering - from Space and BioTech to
              Advanced Materials, Robotics, and beyond.
            </p>
            <p>
              My approach is founder first and long term, often investing when ideas
              are still fragile. For me, supporting startups goes far beyond capital.
              I believe in deploying my capital and time towards shaping deliberate
              futures for our species and strengthening the foundations of civilization.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
