function ScoreMeter({ score }) {
  const clampedScore = Math.max(0, Math.min(100, score))
  const circumference = 2 * Math.PI * 45
  const offset = circumference - (clampedScore / 100) * circumference

  const getScoreColor = (s) => {
    if (s >= 80) return { stroke: '#10b981', text: 'text-emerald-400', label: 'Excellent' }
    if (s >= 65) return { stroke: '#6366f1', text: 'text-brand-400', label: 'Strong' }
    if (s >= 50) return { stroke: '#f59e0b', text: 'text-amber-400', label: 'Good' }
    return { stroke: '#ef4444', text: 'text-red-400', label: 'Needs Work' }
  }

  const { stroke, text, label } = getScoreColor(clampedScore)

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-28 h-28 flex-shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Background track */}
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="8"
          />
          {/* Score arc */}
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke={stroke}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1.2s ease-in-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-bold ${text}`}>{clampedScore}</span>
          <span className="text-xs text-slate-400">/ 100</span>
        </div>
      </div>

      <div>
        <p className={`text-lg font-bold ${text}`}>{label}</p>
        <p className="text-slate-400 text-sm mt-0.5">Overall Score</p>
        <div className="mt-2 h-1.5 w-32 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${clampedScore}%`, background: stroke }}
          />
        </div>
      </div>
    </div>
  )
}

export default function StrengthReport({ report }) {
  if (!report) {
    return (
      <div className="glass-card p-6">
        <h2 className="section-title">
          <span>💪</span>
          <span className="gradient-text">Candidate Strength Report</span>
        </h2>
        <p className="text-slate-400 text-sm">No strength report available.</p>
      </div>
    )
  }

  const { overall_score = 0, strengths = [], profile_summary = '' } = report

  return (
    <div id="strength-report-card" className="glass-card p-6 animate-slide-up">
      <h2 className="section-title">
        <span>💪</span>
        <span className="gradient-text">Candidate Strength Report</span>
      </h2>

      {/* Score meter */}
      <div className="mb-6 p-4 rounded-xl bg-white/3 border border-white/5">
        <ScoreMeter score={overall_score} />
      </div>

      {/* Strengths */}
      {strengths.length > 0 && (
        <div className="mb-5">
          <p className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Key Strengths
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {strengths.map((strength, index) => (
              <div
                key={index}
                id={`strength-item-${index}`}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15"
              >
                <div className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm text-slate-200">{strength}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Profile Summary */}
      {profile_summary && (
        <div className="p-4 rounded-xl bg-brand-500/5 border border-brand-500/15">
          <p className="text-xs font-semibold text-brand-300 mb-2 uppercase tracking-wider">Profile Summary</p>
          <p className="text-slate-300 text-sm leading-relaxed">{profile_summary}</p>
        </div>
      )}
    </div>
  )
}
