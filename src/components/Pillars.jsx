import './Pillars.css'

const pillars = [
  {
    name: 'LIFE',
    description: 'Extending and enriching life through biotech, medicine, food, and healthcare — using science and nature to enhance human flourishing.'
  },
  {
    name: 'MATTER',
    description: 'Mastery of materials and manufacturing — from quantum chips to nanomaterials, advanced alloys to new industrial processes and tools.'
  },
  {
    name: 'MOTION',
    description: 'The ability to move, explore, and connect — Aerospace, rockets, satellites, and geo-spatial tech that expands our reach.'
  },
  {
    name: 'INTELLIGENCE',
    description: "Amplifying the mind's reach: AI, computers, data, and human-machine systems that accelerate discovery."
  },
  {
    name: 'ENERGY',
    description: 'Clean, abundant, and reliable energy — power, advanced nuclear, fusion, grid tech, storage systems that drive progress.'
  }
]

function Pillars() {
  return (
    <section className="pillars">
      <div className="pillars-grid">
        {pillars.map((pillar, index) => (
          <div key={index} className="pillar-item">
            <h3 className="pillar-name">{pillar.name}</h3>
            <p className="pillar-description">{pillar.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Pillars
