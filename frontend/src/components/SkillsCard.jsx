export default function SkillsCard({ skills }) {
  if (!skills || skills.length === 0) {
    return (
      <div className="card" id="skills-card">
        <h3 className="card-title">Skills & Technologies</h3>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>No skills found in this resume.</p>
      </div>
    )
  }

  return (
    <div className="card animate-slide-up" id="skills-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="card-title" style={{ marginBottom: 0 }}>Skills & Technologies</h3>
        <span className="count-badge">{skills.length} found</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span
            key={index}
            id={`skill-badge-${index}`}
            className="skill-tag"
            style={{ animationDelay: `${index * 20}ms` }}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  )
}
