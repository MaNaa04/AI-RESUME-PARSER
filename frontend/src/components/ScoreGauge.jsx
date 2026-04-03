export default function ScoreGauge({ score }) {
  const clampedScore = Math.max(0, Math.min(100, score || 0))
  const circumference = 2 * Math.PI * 45
  const offset = circumference - (clampedScore / 100) * circumference

  const getScoreInfo = (s) => {
    if (s >= 80) return { color: '#10b981', label: 'Excellent' }
    if (s >= 65) return { color: '#2b8cee', label: 'Strong' }
    if (s >= 50) return { color: '#f59e0b', label: 'Good' }
    return { color: '#ef4444', label: 'Needs Work' }
  }

  const { color, label } = getScoreInfo(clampedScore)

  return (
    <div className="score-container" id="score-gauge">
      <div className="score-ring">
        <svg className="w-full h-full" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
          {/* Background track */}
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="7"
          />
          {/* Score arc */}
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1.2s ease-in-out' }}
          />
        </svg>
        <div className="score-value">
          <span className="score-number">
            {clampedScore}<sub>/100</sub>
          </span>
        </div>
      </div>
      <span className="score-label" style={{ color }}>{label}</span>
      <div className="score-bar">
        <div
          className="score-bar-fill"
          style={{ width: `${clampedScore}%`, background: color }}
        />
      </div>
    </div>
  )
}
