import React, { useState, useRef } from "react";
import "../style/home.scss";
import { useInterview } from "../hooks/useInterview";
import { useAuth } from "../../auth/hooks/useAuth";
import { useNavigate } from "react-router";
import { Brand } from "../../../shared/Brand";
import ScoreDial from "../../../shared/ScoreDial";

const MAX_JD = 5000;

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

const Analyzing = () => (
  <main className="analyzing">
    <div className="analyzing__dial">
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round">
        <circle cx="24" cy="24" r="20" />
        <path d="M24 4 L24 24 L41.3 14 M41.3 14 L24 24 L41.3 34 M41.3 34 L24 24 L24 44 M24 44 L24 24 L6.7 34 M6.7 34 L24 24 L6.7 14 M6.7 14 L24 24 L24 4" />
      </svg>
    </div>
    <h1>Bringing the role into focus…</h1>
    <p>Reading your resume, scoring the match, and drafting your questions. This takes around 30 seconds.</p>
  </main>
);

const Home = () => {
  const { loading, error, generateReport, reports } = useInterview();
  const { handleLogout } = useAuth();
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [formNotice, setFormNotice] = useState("");
  const resumeInputRef = useRef();

  const navigate = useNavigate();

  const onFileChange = (e) => {
    const file = e.target.files[0] || null;
    setResumeFile(file);
    setFormNotice("");
  };

  const clearFile = () => {
    setResumeFile(null);
    if (resumeInputRef.current) resumeInputRef.current.value = "";
  };

  const handleGenerateReport = async () => {
    if (!resumeFile) {
      setFormNotice("Upload your resume as a PDF to generate a plan.");
      return;
    }
    if (!jobDescription.trim()) {
      setFormNotice("Paste the target job description first.");
      return;
    }
    setFormNotice("");
    const data = await generateReport({ jobDescription, selfDescription, resumeFile });
    if (data?._id) {
      navigate(`/interview/${data._id}`);
    }
  };

  const onLogout = async () => {
    await handleLogout();
    navigate("/login");
  };

  if (loading) return <Analyzing />;

  return (
    <div className="home">
      <header className="topbar">
        <Brand />
        <button className="button ghost-button topbar__logout" onClick={onLogout}>
          Log out
        </button>
      </header>

      <div className="home__inner rise">
        <header className="home-hero">
          <span className="eyebrow">New analysis</span>
          <h1>
            Put this role <span className="highlight">in focus.</span>
          </h1>
          <p>
            Drop in the job description and your resume. HireLens scores the fit
            and builds a tailored interview plan.
          </p>
        </header>

        <div className="composer card">
          <div className="composer__grid">
            {/* Job description */}
            <section className="field">
              <div className="field__head">
                <span className="field__step">01</span>
                <h2>Target job description</h2>
                <span className="tag tag--req">Required</span>
              </div>
              <textarea
                className="field__textarea"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value.slice(0, MAX_JD))}
                placeholder={`Paste the full job posting here — responsibilities, requirements, the stack.\n\ne.g. "Full-Stack Developer (MERN) — 3+ yrs with React, Node, Express, MongoDB…"`}
              />
              <div className="field__meter">{jobDescription.length} / {MAX_JD}</div>
            </section>

            <div className="composer__rule" />

            {/* Profile */}
            <section className="field">
              <div className="field__head">
                <span className="field__step">02</span>
                <h2>Your profile</h2>
                <span className="tag tag--req">Required</span>
              </div>

              {!resumeFile ? (
                <label className="dropzone" htmlFor="resume">
                  <span className="dropzone__icon">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.9A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 2.5 8.2" /><path d="M12 12v9" /><path d="m8 17 4-4 4 4" /></svg>
                  </span>
                  <p className="dropzone__title">Upload your resume</p>
                  <p className="dropzone__hint">PDF only · up to 3&nbsp;MB</p>
                  <input
                    ref={resumeInputRef}
                    hidden
                    type="file"
                    id="resume"
                    name="resume"
                    accept="application/pdf,.pdf"
                    onChange={onFileChange}
                  />
                </label>
              ) : (
                <div className="file-chip">
                  <span className="file-chip__icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>
                  </span>
                  <span className="file-chip__meta">
                    <span className="file-chip__name">{resumeFile.name}</span>
                    <span className="file-chip__size">{formatSize(resumeFile.size)} · ready</span>
                  </span>
                  <button type="button" className="file-chip__remove" onClick={clearFile} aria-label="Remove file">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                  </button>
                </div>
              )}

              <div className="field__optional">
                <label className="field__sublabel" htmlFor="selfDescription">
                  Add context <span>optional</span>
                </label>
                <textarea
                  id="selfDescription"
                  className="field__textarea field__textarea--short"
                  value={selfDescription}
                  onChange={(e) => setSelfDescription(e.target.value)}
                  placeholder="Anything the resume doesn't say — focus areas, years of experience, what you want to emphasize."
                />
              </div>
            </section>
          </div>

          {(formNotice || error) && (
            <div className="notice notice--error composer__notice" role="alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>
              <span>{formNotice || error}</span>
            </div>
          )}

          <div className="composer__foot">
            <span className="composer__note">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
              AI analysis takes about 30 seconds.
            </span>
            <button className="button primary-button" onClick={handleGenerateReport} disabled={loading}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3v4M3 5h4M6 17v4M4 19h4M13 3l2.5 6.5L22 12l-6.5 2.5L13 21l-2.5-6.5L4 12l6.5-2.5z" /></svg>
              Generate my plan
            </button>
          </div>
        </div>

        {reports.length > 0 && (
          <section className="recent">
            <div className="recent__head">
              <span className="eyebrow">Your reports</span>
              <h2>Recent analyses</h2>
            </div>
            <ul className="recent__list">
              {reports.map((report) => (
                <li key={report._id} className="recent-card" onClick={() => navigate(`/interview/${report._id}`)}>
                  <div className="recent-card__dial">
                    <ScoreDial score={report.matchScore} size={88} />
                  </div>
                  <div className="recent-card__body">
                    <h3>{report.title || "Untitled position"}</h3>
                    <p className="recent-card__date">
                      {new Date(report.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <span className="recent-card__arrow">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
};

export default Home;
