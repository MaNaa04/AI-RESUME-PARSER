export default function SkillsCard({ skills }) {
  if (!skills || skills.length === 0) {
    return (
      <div className="glass-card p-6">
        <h2 className="section-title">
          <span>🛠️</span>
          <span className="gradient-text">Skills & Technologies</span>
        </h2>
        <p className="text-slate-400 text-sm">No skills found in this resume.</p>
      </div>
    )
  }

  return (
    <div id="skills-card" className="glass-card p-6 animate-slide-up">
      <h2 className="section-title">
        <span>🛠️</span>
        <span className="gradient-text">Skills & Technologies</span>
        <span className="ml-auto text-xs text-slate-400 font-normal bg-white/5 px-2 py-1 rounded-full">
          {skills.length} found
        </span>
      </h2>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span
            key={index}
            id={`skill-badge-${index}`}
            className="skill-badge cursor-default"
            style={{ animationDelay: `${index * 30}ms` }}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  )
}
