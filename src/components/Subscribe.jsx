import { useState } from 'react'
import './Subscribe.css'

const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL

function Subscribe() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name.trim() || !email.trim()) {
      setStatus('error')
      setErrorMsg('Please fill in both name and email.')
      return
    }

    setStatus('loading')
    setErrorMsg('')

    try {
      const params = new URLSearchParams()
      params.append('name', name.trim())
      params.append('email', email.trim())

      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      })

      // no-cors returns opaque response (status 0), so we can't read it
      // Trust that the request went through if no network error was thrown
      setStatus('success')
      setName('')
      setEmail('')
    } catch {
      setStatus('error')
      setErrorMsg('Something went wrong. Please try again.')
    }
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
            disabled={status === 'loading'}
          />
          <input
            type="email"
            placeholder="YOUR EMAIL"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="subscribe-input"
            disabled={status === 'loading'}
          />
          <button
            type="submit"
            className="subscribe-button"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'SUBSCRIBING...' : 'SUBSCRIBE TO CONTENT'}
          </button>
          {status === 'success' && (
            <p className="subscribe-message subscribe-success">
              Thanks for subscribing!
            </p>
          )}
          {status === 'error' && (
            <p className="subscribe-message subscribe-error">{errorMsg}</p>
          )}
        </form>
      </div>
    </section>
  )
}

export default Subscribe
