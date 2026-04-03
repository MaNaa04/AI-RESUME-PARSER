export default function ExperienceCard({ experiences }) {
  if (!experiences || experiences.length === 0) {
    return (
      <div className="card" id="experience-card">
        <h3 className="card-title">Work Experience</h3>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>No work experience found in this resume.</p>
      </div>
    )
  }

  return (
    <div className="card animate-slide-up" id="experience-card">
      <h3 className="card-title">Work Experience</h3>
      <div className="flex flex-col gap-3">
        {experiences.map((exp, index) => (
          <div key={index} id={`experience-item-${index}`} className="exp-item">
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
              {exp.key_contributions && exp.key_contributions.length > 0 && (
                <div className="mt-2 flex flex-col gap-1">
                  {exp.key_contributions.map((c, cIdx) => (
                    <p key={cIdx} className="exp-bullet">{c}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
