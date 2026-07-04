import React from "react";
import "../style/interview.scss";

const Interview = () => {
  return (
    <main className="interview">
      {/* Left : section navigation */}
      <aside className="interview__nav">
        <p className="interview__eyebrow">Sections</p>
        <ul className="nav-list">
          <li className="nav-list__item">
            <span className="nav-list__icon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m8 9-3 3 3 3" />
                <path d="m16 9 3 3-3 3" />
              </svg>
            </span>
            Technical Questions
          </li>
          <li className="nav-list__item nav-list__item--active">
            <span className="nav-list__icon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z" />
              </svg>
            </span>
            Behavioral Questions
          </li>
          <li className="nav-list__item">
            <span className="nav-list__icon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m3 11 19-9-9 19-2-8z" />
              </svg>
            </span>
            Road Map
          </li>
        </ul>
      </aside>

      {/* Center : main content */}
      <section className="interview__content">
        <header className="content-head">
          <h1 className="content-head__title">Behavioral Questions</h1>
          <span className="content-head__count">2 questions</span>
        </header>

        <div className="q-list">
          <details className="q-card" open>
            <summary className="q-card__summary">
              <span className="q-card__marker">Q1</span>
              <span className="q-card__question">
                Describe a time when you had to optimize a piece of code that
                was causing production delays. How did you identify the
                bottleneck?
              </span>
              <span className="q-card__chevron" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </summary>
            <div className="q-card__body">
              <p className="q-card__label">Why they ask</p>
              <p className="q-card__text">
                To understand the candidate's problem-solving approach,
                initiative, and the measurable impact of their work.
              </p>
              <p className="q-card__label">How to answer</p>
              <p className="q-card__text">
                Use the STAR method. Detail the problem faced, the specific
                actions taken, and the measurable results.
              </p>
            </div>
          </details>

          <details className="q-card">
            <summary className="q-card__summary">
              <span className="q-card__marker">Q2</span>
              <span className="q-card__question">
                How do you approach learning a new technology, such as your
                recent work with the Gemini API?
              </span>
              <span className="q-card__chevron" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </summary>
            <div className="q-card__body">
              <p className="q-card__label">Why they ask</p>
              <p className="q-card__text">
                To gauge commitment to continuous learning and proactive skill
                development.
              </p>
              <p className="q-card__label">How to answer</p>
              <p className="q-card__text">
                Mention specific resources and how you apply new learning in
                side projects or current work.
              </p>
            </div>
          </details>
        </div>
      </section>

      {/* Right : score + skill gaps */}
      <aside className="interview__aside">
        <div className="score">
          <p className="interview__eyebrow">Match Score</p>
          <div className="score__ring">
            <svg viewBox="0 0 100 100" width="120" height="120">
              <circle className="score__track" cx="50" cy="50" r="42" />
              <circle
                className="score__value"
                cx="50"
                cy="50"
                r="42"
                strokeDasharray="263.9"
                strokeDashoffset="31.7"
              />
            </svg>
            <div className="score__number">
              <strong>88</strong>
              <span>%</span>
            </div>
          </div>
          <p className="score__caption">Strong match for this role</p>
        </div>

        <div className="skill-gaps">
          <p className="interview__eyebrow">Skill Gaps</p>
          <ul className="gap-list">
            <li className="gap-card gap-card--high">
              Message Queues (Kafka/RabbitMQ)
            </li>
            <li className="gap-card gap-card--medium">
              Advanced Docker &amp; CI/CD Pipelines
            </li>
            <li className="gap-card gap-card--medium">
              Distributed Systems Design
            </li>
            <li className="gap-card gap-card--low">
              Production-level Redis management
            </li>
          </ul>
        </div>
      </aside>
    </main>
  );
};

export default Interview;
