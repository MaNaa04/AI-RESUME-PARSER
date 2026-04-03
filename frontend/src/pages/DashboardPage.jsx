import { Link } from 'react-router-dom'
import FileUpload from '../components/FileUpload'
import ScoreGauge from '../components/ScoreGauge'
import SkillsCard from '../components/SkillsCard'
import ExperienceCard from '../components/ExperienceCard'
import EducationCard from '../components/EducationCard'

/* ── Skeleton Loader ── */
function SkeletonLoader() {
  return (
    <div className="animate-fade-in" id="skeleton-loader">
      <p className="text-center text-sm mb-6 flex items-center justify-center gap-2"
        style={{ color: 'var(--text-tertiary)' }}>
        <svg className="animate-spin w-4 h-4" style={{ color: 'var(--accent-blue)' }} fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Gemini is analyzing your resume…
      </p>
      <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
        {[1, 2, 3].map(i => (
          <div key={i} className="card">
            <div className="skeleton-block mb-3" style={{ height: 18, width: '60%' }} />
            <div className="skeleton-block mb-2" style={{ height: 60, width: '100%' }} />
            <div className="skeleton-block" style={{ height: 14, width: '80%' }} />
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Error Banner ── */
function ErrorBanner({ message, onDismiss }) {
  return (
    <div id="error-banner" className="error-banner animate-fade-in">
      <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
        style={{ background: 'rgba(239,68,68,0.15)' }}>
        <svg className="w-4 h-4" style={{ color: 'var(--accent-red)' }} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="flex-1">
        <p className="font-semibold text-sm" style={{ color: '#fca5a5' }}>Analysis Failed</p>
        <p className="text-sm mt-0.5" style={{ color: '#f87171' }}>{message}</p>
      </div>
      <button onClick={onDismiss} aria-label="Dismiss error"
        className="flex-shrink-0 p-1 transition-colors" style={{ color: '#f87171' }}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

/* ── Results Dashboard Grid ── */
function ResultsDashboard({ insights, onReset }) {
  const { candidate_strength_report, skills_and_technologies, work_experience_summary, education } = insights

  return (
    <div className="animate-fade-in" id="results-dashboard">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Analysis Complete</h2>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Powered by Google Gemini AI</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/deep-dive"
            className="btn-secondary"
            style={{ textDecoration: 'none' }}
            id="view-deepdive-btn"
          >
            View Detailed Report →
          </Link>
          <button
            id="analyze-another-btn"
            onClick={onReset}
            className="btn-secondary"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Analyze Another
          </button>
        </div>
      </div>

      {/* Three-column grid matching Stitch dashboard */}
      <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
        {/* Column 1: Score + Summary */}
        <div className="flex flex-col gap-4">
          <div className="card" id="score-card">
            <ScoreGauge score={candidate_strength_report?.overall_score} />
          </div>
          <div className="card" id="summary-card">
            <h3 className="card-title" style={{ fontSize: '14px' }}>Candidate Summary</h3>
            <p style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              lineHeight: '1.7',
            }}>
              {candidate_strength_report?.profile_summary || 'No summary available.'}
            </p>
            {candidate_strength_report?.strengths?.length > 0 && (
              <div className="mt-3">
                {candidate_strength_report.strengths.map((s, i) => (
                  <div key={i} className="flex items-start gap-2 mb-1.5">
                    <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent-green)' }} />
                    <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{s}</span>
                  </div>
                ))}
              </div>
            )}
            <Link to="/deep-dive" className="view-link mt-3" style={{ display: 'inline-flex' }} id="view-detailed-link">
              View Detailed Report
            </Link>
          </div>
        </div>

        {/* Column 2: Skills + Experience Card (with ExperienceCard label) */}
        <div className="flex flex-col gap-4">
          <SkillsCard skills={skills_and_technologies} />
          <ExperienceCard experiences={work_experience_summary} />
        </div>

        {/* Column 3: Work Experience (first entry) + Education */}
        <div className="flex flex-col gap-4">
          {/* Work Experience mini card — showing top experience */}
          <div className="card animate-slide-up" id="work-exp-mini">
            <h3 className="card-title">Work Experience</h3>
            {work_experience_summary && work_experience_summary.length > 0 ? (
              <div className="flex flex-col gap-3">
                {work_experience_summary.slice(0, 2).map((exp, index) => (
                  <div key={index} className="exp-item">
                    <div className="exp-check">
                      <svg width="12" height="12" viewBox="0 0 20 20" fill="var(--accent-blue)">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="exp-role">{exp.role || 'Unknown Role'}</p>
                      <p className="exp-company">
                        {exp.company || 'Unknown Company'}
                        {exp.duration ? ` · ${exp.duration}` : ''}
                      </p>
                      {exp.key_contributions?.slice(0, 3).map((c, cIdx) => (
                        <p key={cIdx} className="exp-bullet">{c}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>No experience found.</p>
            )}
          </div>
          <EducationCard education={education} />
        </div>
      </div>
    </div>
  )
}

/* ── Dashboard Page ── */
export default function DashboardPage({ status, insights, errorMessage, onUpload, onReset }) {
  const showUpload = status === 'idle' || status === 'error'

  return (
    <div className="p-6" id="dashboard-page">
      {/* Upload section */}
      {showUpload && (
        <div className="card mb-6 animate-fade-in" style={{ maxWidth: 700, margin: '0 auto 24px' }}>
          <FileUpload onUpload={onUpload} isLoading={status === 'loading'} />
          {status === 'error' && (
            <div className="mt-4">
              <ErrorBanner message={errorMessage} onDismiss={onReset} />
            </div>
          )}
        </div>
      )}

      {/* Loading skeleton */}
      {status === 'loading' && (
        <div className="card" style={{ maxWidth: 1100, margin: '0 auto' }}>
          <SkeletonLoader />
        </div>
      )}

      {/* Results */}
      {status === 'success' && insights && (
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <ResultsDashboard insights={insights} onReset={onReset} />
        </div>
      )}
    </div>
  )
}
