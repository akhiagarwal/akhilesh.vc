import { useState, useRef } from 'react'
import './Subscribe.css'

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyYVUQ5BhRGbdRDa_gH6zyv9l6G7RhNSH5ptQJRiBx-FcSsNKt100BuLVFZvLcWH8k/exec'

function Subscribe() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('')
  const iframeRef = useRef(null)
  const formRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!name.trim() || !email.trim()) {
      setStatus('error')
      setErrorMsg('Please fill in both name and email.')
      return
    }

    setStatus('loading')
    setErrorMsg('')

    // Submit via hidden iframe to avoid CORS/redirect issues
    const iframe = iframeRef.current
    const form = formRef.current

    // Listen for iframe load (means Apps Script responded)
    const onLoad = () => {
      iframe.removeEventListener('load', onLoad)
      setStatus('success')
      setName('')
      setEmail('')
    }
    iframe.addEventListener('load', onLoad)

    // Set a timeout in case iframe load doesn't fire
    setTimeout(() => {
      if (status === 'loading') {
        setStatus('success')
        setName('')
        setEmail('')
      }
    }, 5000)

    form.submit()
  }

  return (
    <section className="subscribe">
      <div className="container">
        {/* Hidden iframe target for form submission */}
        <iframe
          ref={iframeRef}
          name="subscribe-iframe"
          style={{ display: 'none' }}
          title="subscribe"
        />

        {/* Visible React-controlled form */}
        <div className="subscribe-form" role="form">
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
            type="button"
            className="subscribe-button"
            disabled={status === 'loading'}
            onClick={handleSubmit}
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
        </div>

        {/* Hidden real form that submits to iframe */}
        <form
          ref={formRef}
          action={GOOGLE_SCRIPT_URL}
          method="POST"
          target="subscribe-iframe"
          style={{ display: 'none' }}
        >
          <input type="hidden" name="name" value={name} />
          <input type="hidden" name="email" value={email} />
        </form>
      </div>
    </section>
  )
}

export default Subscribe
