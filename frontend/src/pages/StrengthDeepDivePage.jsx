import { Link } from 'react-router-dom'
import ScoreGauge from '../components/ScoreGauge'

export default function StrengthDeepDivePage({ insights }) {
  if (!insights) {
    return (
      <div className="p-8 text-center animate-fade-in">
        <div className="card" style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="1.5" style={{ margin: '0 auto 16px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="card-title" style={{ textAlign: 'center' }}>No Analysis Available</h3>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '13px', marginBottom: 20 }}>
            Upload and analyse a resume first to see the deep-dive view.
          </p>
          <Link to="/" className="btn-analyze" style={{ textDecoration: 'none', display: 'inline-flex' }}>
            Go to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const { skills_and_technologies = [], candidate_strength_report = {} } = insights
  const { strengths = [], profile_summary = '' } = candidate_strength_report

  return (
    <div className="p-6 animate-fade-in" id="strength-deepdive-page">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-2">
        <div>
          {/* Search bar (decorative, matching Stitch) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-full)',
            padding: '6px 16px',
            width: 280,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <span style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>Search</span>
          </div>
        </div>
        <Link to="/" className="btn-secondary" style={{ textDecoration: 'none' }}>
          ← Back to Dashboard
        </Link>
      </div>

      {/* Two-column layout */}
      <div className="grid gap-6" style={{ gridTemplateColumns: '1.1fr 1fr' }}>
        {/* Left: Strength Report */}
        <div className="card" id="strength-report-detail">
          <h3 className="card-title">Strength Report</h3>

          {/* Profile Summary Box */}
          {profile_summary && (
            <div className="profile-summary-box mb-5">
              <p className="profile-summary-label">Profile Summary</p>
              <p className="profile-summary-text">{profile_summary}</p>
            </div>
          )}

          {/* Strengths Grid (2x2) */}
          {strengths.length > 0 && (
            <div className="grid gap-3" style={{ gridTemplateColumns: '1fr 1fr' }}>
              {strengths.map((strength, index) => (
                <div key={index} className="strength-card" id={`strength-detail-${index}`}>
                  <div className="flex items-start gap-3">
                    <div className="strength-icon">
                      <svg width="12" height="12" viewBox="0 0 20 20" fill="var(--accent-green)">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="strength-title">{strength}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Skills & Technologies */}
        <div className="card" id="skills-detail">
          <div className="flex items-center justify-between mb-2">
            <h3 className="card-title" style={{ marginBottom: 0 }}>Skills & Technologies</h3>
          </div>
          <p className="card-subtitle">{skills_and_technologies.length} found</p>

          <div className="flex flex-wrap gap-2 mt-2">
            {skills_and_technologies.map((skill, index) => (
              <span key={index} className="skill-tag" id={`skill-detail-${index}`}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
