import ScoreGauge from './ScoreGauge'

export default function StrengthReport({ report }) {
  if (!report) {
    return (
      <div className="card" id="strength-report-card">
        <h3 className="card-title">Candidate Summary</h3>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>No strength report available.</p>
      </div>
    )
  }

  const { overall_score = 0, strengths = [], profile_summary = '' } = report

  return (
    <div className="card animate-slide-up" id="strength-report-card">
      {/* Score */}
      <ScoreGauge score={overall_score} />

      {/* Summary */}
      {profile_summary && (
        <div className="mt-4">
          <h3 className="card-title" style={{ fontSize: '14px' }}>Candidate Summary</h3>
          <p style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            lineHeight: '1.7',
          }}>
            {profile_summary}
          </p>
        </div>
      )}

      {/* Strengths (inline list) */}
      {strengths.length > 0 && (
        <div className="mt-4">
          {strengths.map((s, i) => (
            <div key={i} className="flex items-start gap-2 mb-2" id={`strength-item-${i}`}>
              <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent-green)' }} />
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{s}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
