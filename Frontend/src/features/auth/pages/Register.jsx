import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'
import { Brand, ApertureGlyph } from '../../../shared/Brand'

const Register = () => {

  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const { loading, error, handleRegister } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const ok = await handleRegister({ username, email, password })
    if (ok) navigate('/')
  }

  return (
    <div className="auth">
      <aside className="auth__aside">
        <Brand />
        <div className="auth__pitch">
          <span className="eyebrow">Interview readiness</span>
          <h1>Walk in already prepared.</h1>
          <p>
            Create an account to turn any job description into a focused prep
            plan — scored, tailored, and ready in under a minute.
          </p>
          <ApertureGlyph className="auth__aperture" />
        </div>
        <span className="auth__foot">// focus. prepare. land it.</span>
      </aside>

      <main className="auth__main">
        <div className="form-container rise">
          <h1>Create your account</h1>
          <p className="sub">It takes a moment. No card required.</p>

          {error && (
            <div className="notice notice--error" role="alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text" name="username" id="username" placeholder='Pick a username' autoComplete="username" />
            </div>

            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email" name="email" id="email" placeholder='you@email.com' autoComplete="email" />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password" name="password" id="password" placeholder='Create a password' autoComplete="new-password" />
            </div>

            <button className='button primary-button' disabled={loading}>
              {loading ? "Creating…" : "Create account"}
            </button>
          </form>

          <p className="swap">Already have an account? <Link to={"/login"}>Log in</Link></p>
        </div>
      </main>
    </div>
  )
}

export default Register
