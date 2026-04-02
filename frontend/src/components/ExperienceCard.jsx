export default function ExperienceCard({ experiences }) {
  if (!experiences || experiences.length === 0) {
    return (
      <div className="glass-card p-6">
        <h2 className="section-title">
          <span>💼</span>
          <span className="gradient-text">Work Experience</span>
        </h2>
        <p className="text-slate-400 text-sm">No work experience found in this resume.</p>
      </div>
    )
  }

  return (
    <div id="experience-card" className="glass-card p-6 animate-slide-up">
      <h2 className="section-title">
        <span>💼</span>
        <span className="gradient-text">Work Experience</span>
        <span className="ml-auto text-xs text-slate-400 font-normal bg-white/5 px-2 py-1 rounded-full">
          {experiences.length} {experiences.length === 1 ? 'position' : 'positions'}
        </span>
      </h2>

      <div className="relative">
        {/* Timeline vertical line */}
        <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gradient-to-b from-brand-500 via-purple-500 to-transparent opacity-40" />

        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <div
              key={index}
              id={`experience-item-${index}`}
              className="relative pl-10"
            >
              {/* Timeline dot */}
              <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-lg shadow-brand-500/30">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>

              <div className="glass-card-hover p-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-2">
                  <div>
                    <h3 className="text-white font-semibold text-base">{exp.role || 'Unknown Role'}</h3>
                    <p className="text-brand-300 font-medium text-sm">{exp.company || 'Unknown Company'}</p>
                  </div>
                  {exp.duration && (
                    <span className="flex-shrink-0 text-xs text-slate-400 bg-white/5 border border-white/10 px-2 py-1 rounded-full whitespace-nowrap">
                      📅 {exp.duration}
                    </span>
                  )}
                </div>

                {exp.key_contributions && exp.key_contributions.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {exp.key_contributions.map((contribution, cIdx) => (
                      <li key={cIdx} className="flex items-start gap-2 text-sm text-slate-300">
                        <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-brand-400" />
                        {contribution}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
