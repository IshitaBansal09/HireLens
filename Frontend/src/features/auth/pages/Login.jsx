import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'
import { Brand, ApertureGlyph } from '../../../shared/Brand'


const Login = () => {

  const { loading, error, handleLogin } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    const ok = await handleLogin({ email, password })
    if (ok) navigate('/')
  }

  return (
    <div className="auth">
      <aside className="auth__aside">
        <Brand />
        <div className="auth__pitch">
          <span className="eyebrow">Interview readiness</span>
          <h1>See the role before it sees you.</h1>
          <p>
            HireLens reads your resume against the job, scores the fit, and
            hands you the questions, gaps, and a day-by-day plan.
          </p>
          <ApertureGlyph className="auth__aperture" />
        </div>
        <span className="auth__foot">// focus. prepare. land it.</span>
      </aside>

      <main className="auth__main">
        <div className="form-container rise">
          <h1>Welcome back</h1>
          <p className="sub">Log in to pick up your prep where you left off.</p>

          {error && (
            <div className="notice notice--error" role="alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
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
                type="password" name="password" id="password" placeholder='••••••••' autoComplete="current-password" />
            </div>

            <button className='button primary-button' disabled={loading}>
              {loading ? "Logging in…" : "Log in"}
            </button>
          </form>

          <p className="swap">New here? <Link to={"/register"}>Create an account</Link></p>
        </div>
      </main>
    </div>
  )
}

export default Login
