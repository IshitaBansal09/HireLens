import React, { useState, useEffect } from 'react'
import '../style/interview.scss'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate, useParams } from 'react-router'
import { Brand } from '../../../shared/Brand'
import ScoreDial from '../../../shared/ScoreDial'

const NAV_ITEMS = [
    { id: 'technical', label: 'Technical', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>) },
    { id: 'behavioral', label: 'Behavioral', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>) },
    { id: 'roadmap', label: 'Prep roadmap', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>) },
]

// ── Sub-components ────────────────────────────────────────────────────────────
const QuestionCard = ({ item, index }) => {
    const [open, setOpen] = useState(false)
    return (
        <div className={`q-card ${open ? 'q-card--open' : ''}`}>
            <button className='q-card__header' onClick={() => setOpen(o => !o)}>
                <span className='q-card__index'>Q{String(index + 1).padStart(2, '0')}</span>
                <p className='q-card__question'>{item.question}</p>
                <span className='q-card__chevron'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                </span>
            </button>
            {open && (
                <div className='q-card__body'>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--intention'>Why they ask</span>
                        <p>{item.intention}</p>
                    </div>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--answer'>How to answer</span>
                        <p>{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

const RoadMapDay = ({ day }) => (
    <div className='roadmap-day'>
        <div className='roadmap-day__rail'>
            <span className='roadmap-day__badge'>Day {day.day}</span>
        </div>
        <div className='roadmap-day__content'>
            <h3 className='roadmap-day__focus'>{day.focus}</h3>
            <ul className='roadmap-day__tasks'>
                {day.tasks.map((task, i) => (
                    <li key={i}>
                        <span className='roadmap-day__bullet' />
                        {task}
                    </li>
                ))}
            </ul>
        </div>
    </div>
)

// ── Main Component ────────────────────────────────────────────────────────────
const Interview = () => {
    const [activeNav, setActiveNav] = useState('technical')
    const { report, getReportById, loading, getResumePdf } = useInterview()
    const { interviewId } = useParams()
    const navigate = useNavigate()
    // null | 'download' | 'regenerate'
    const [downloading, setDownloading] = useState(null)

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        }
    }, [interviewId])

    const onDownload = async () => {
        setDownloading('download')
        await getResumePdf(interviewId)
        setDownloading(null)
    }

    const onRegenerate = async () => {
        if (!window.confirm('Generate a new tailored resume? This replaces the one you downloaded before.')) return
        setDownloading('regenerate')
        await getResumePdf(interviewId, { regenerate: true })
        setDownloading(null)
    }

    if (loading || !report) {
        return (
            <main className='analyzing'>
                <div className='analyzing__dial'>
                    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round"><circle cx="24" cy="24" r="20" /><path d="M24 4 L24 24 L41.3 14 M41.3 14 L24 24 L41.3 34 M41.3 34 L24 24 L24 44 M24 44 L24 24 L6.7 34 M6.7 34 L24 24 L6.7 14 M6.7 14 L24 24 L24 4" /></svg>
                </div>
                <h1>Loading your plan…</h1>
            </main>
        )
    }

    const score = report.matchScore
    const verdict =
        score >= 80 ? 'Strong match — lead with your strengths.' :
            score >= 60 ? 'Solid match — close the gaps below.' :
                'Early match — the roadmap will get you there.'

    const SECTION = {
        technical: { title: 'Technical questions', count: `${report.technicalQuestions.length} questions`, body: (
            <div className='q-list'>{report.technicalQuestions.map((q, i) => <QuestionCard key={i} item={q} index={i} />)}</div>
        )},
        behavioral: { title: 'Behavioral questions', count: `${report.behavioralQuestions.length} questions`, body: (
            <div className='q-list'>{report.behavioralQuestions.map((q, i) => <QuestionCard key={i} item={q} index={i} />)}</div>
        )},
        roadmap: { title: 'Preparation roadmap', count: `${report.preparationPlan.length}-day plan`, body: (
            <div className='roadmap-list'>{report.preparationPlan.map((day) => <RoadMapDay key={day.day} day={day} />)}</div>
        )},
    }
    const current = SECTION[activeNav]

    return (
        <div className='interview-page'>
            <header className='topbar'>
                <Brand />
                <button className='button ghost-button topbar__logout' onClick={() => navigate('/')}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.4rem' }}><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                    New analysis
                </button>
            </header>

            <div className='interview-shell rise'>
                {/* Report header */}
                <div className='report-head'>
                    <span className='eyebrow'>Interview readiness report</span>
                    <h1>{report.title || 'Your interview plan'}</h1>
                </div>

                <div className='interview-layout'>
                    {/* ── Left Nav ── */}
                    <nav className='interview-nav'>
                        <p className='interview-nav__label'>Sections</p>
                        {NAV_ITEMS.map(item => (
                            <button
                                key={item.id}
                                className={`interview-nav__item ${activeNav === item.id ? 'interview-nav__item--active' : ''}`}
                                onClick={() => setActiveNav(item.id)}
                            >
                                <span className='interview-nav__icon'>{item.icon}</span>
                                {item.label}
                            </button>
                        ))}

                        <button onClick={onDownload} disabled={!!downloading} className='button primary-button interview-nav__download'>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 10l5 5 5-5" /><path d="M12 15V3" /></svg>
                            {downloading === 'download' ? 'Tailoring…' : 'Download tailored resume'}
                        </button>
                        <button onClick={onRegenerate} disabled={!!downloading} className='button ghost-button interview-nav__regenerate'>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-2.64-6.36" /><path d="M21 3v6h-6" /></svg>
                            {downloading === 'regenerate' ? 'Regenerating…' : 'Regenerate resume'}
                        </button>
                    </nav>

                    {/* ── Center Content ── */}
                    <main className='interview-content'>
                        <div className='content-header'>
                            <h2>{current.title}</h2>
                            <span className='content-header__count'>{current.count}</span>
                        </div>
                        {current.body}
                    </main>

                    {/* ── Right Sidebar ── */}
                    <aside className='interview-sidebar'>
                        <div className='score-panel'>
                            <p className='score-panel__label eyebrow'>Match score</p>
                            <ScoreDial score={score} size={176} />
                            <p className='score-panel__verdict'>{verdict}</p>
                        </div>

                        <div className='sidebar-divider' />

                        <div className='skill-gaps'>
                            <p className='eyebrow'>Skill gaps</p>
                            <div className='skill-gaps__list'>
                                {report.skillGaps.length === 0 && (
                                    <p className='skill-gaps__empty'>No major gaps — you're well aligned.</p>
                                )}
                                {report.skillGaps.map((gap, i) => (
                                    <span key={i} className={`sev sev--${gap.severity}`}>{gap.skill}</span>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}

export default Interview
