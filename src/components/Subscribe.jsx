import { useState } from 'react'
import './Subscribe.css'

function Subscribe() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log('Subscribe:', { name, email })
    setName('')
    setEmail('')
  }

  return (
    <section className="subscribe">
      <div className="container">
        <form className="subscribe-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="YOUR NAME"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="subscribe-input"
          />
          <input
            type="email"
            placeholder="YOUR EMAIL"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="subscribe-input"
          />
          <button type="submit" className="subscribe-button">
            SUBSCRIBE
          </button>
        </form>
      </div>
    </section>
  )
}

export default Subscribe
