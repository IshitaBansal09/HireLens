import React from 'react'
import "../style/home.scss"

const Home = () => {
  return (
    <main className='home'>
      <header className="home__header">
        <h1 className="home__title">
          Create Your Custom <span className="highlight">Interview Plan</span>
        </h1>
        <p className="home__subtitle">
          Let our AI analyze the job requirements and your unique profile to build a
          winning strategy.
        </p>
      </header>

      <section className="plan-card">
        <div className="plan-card__body">
          {/* Left panel : Target Job Description */}
          <div className="panel panel--left">
            <div className="panel__head">
              <h2 className="panel__title">
                <span className="panel__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" />
                    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </span>
                Target Job Description
              </h2>
              <span className="badge badge--required">Required</span>
            </div>

            <div className="textarea-wrap">
              <textarea
                className="field-textarea"
                name="jobDescription"
                id="jobDescription"
                placeholder={'Paste the full job description here...\ne.g. "Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design..."'}
              />
              <span className="char-counter">0 / 5000 chars</span>
            </div>
          </div>

          {/* Divider */}
          <div className="panel-divider" aria-hidden="true">
            <span className="panel-divider__dot" />
          </div>

          {/* Right panel : Your Profile */}
          <div className="panel panel--right">
            <div className="panel__head">
              <h2 className="panel__title">
                <span className="panel__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                Your Profile
              </h2>
            </div>

            <div className="field">
              <p className="field__label">
                Upload Resume <span className="field__hint">Most Reliable</span>
              </p>

              <label className="dropzone" htmlFor="resume">
                <span className="dropzone__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                    <path d="M12 12v9" />
                    <path d="m8 17 4-4 4 4" />
                  </svg>
                </span>
                <span className="dropzone__primary">Click to upload or drag &amp; drop</span>
                <span className="dropzone__secondary">PDF or DOCX (Max 5MB)</span>
                <input hidden type="file" name="resume" id="resume" accept=".pdf,.docx" />
              </label>
            </div>

            <div className="or-divider" aria-hidden="true">
              <span className="or-divider__line" />
              <span className="or-divider__text">OR</span>
              <span className="or-divider__line" />
            </div>

            <div className="field">
              <p className="field__label">Quick Self-Description</p>
              <textarea
                className="field-textarea field-textarea--short"
                name="selfDescription"
                id="selfDescription"
                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
              />
            </div>

            <div className="info-banner">
              <span className="info-banner__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
              </span>
              <p className="info-banner__text">
                Either a <strong>Resume</strong> or a <strong>Self Description</strong> is
                required to generate a personalized plan.
              </p>
            </div>
          </div>
        </div>

        <div className="plan-card__footer">
          <span className="plan-card__note">
            AI-Powered Strategy Generation &bull; Approx 30s
          </span>
          <button className="button primary-button generate-btn">
            <span className="generate-btn__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v18" />
                <path d="M5 10l7-7 7 7" />
                <path d="M5 21h14" />
              </svg>
            </span>
            Generate My Interview Strategy
          </button>
        </div>
      </section>

      <footer className="home__footer">
        <a href="#privacy">Privacy Policy</a>
        <a href="#terms">Terms of Service</a>
        <a href="#help">Help Center</a>
      </footer>
    </main>
  )
}

export default Home
