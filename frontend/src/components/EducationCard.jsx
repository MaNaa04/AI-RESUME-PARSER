export default function EducationCard({ education }) {
  if (!education || education.length === 0) {
    return (
      <div className="glass-card p-6">
        <h2 className="section-title">
          <span>🎓</span>
          <span className="gradient-text">Education</span>
        </h2>
        <p className="text-slate-400 text-sm">No education details found in this resume.</p>
      </div>
    )
  }

  return (
    <div id="education-card" className="glass-card p-6 animate-slide-up">
      <h2 className="section-title">
        <span>🎓</span>
        <span className="gradient-text">Education</span>
      </h2>

      <div className="grid gap-3 sm:grid-cols-2">
        {education.map((edu, index) => (
          <div
            key={index}
            id={`education-item-${index}`}
            className="glass-card-hover p-4 rounded-xl relative overflow-hidden group"
          >
            {/* Accent gradient top border */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-500 to-purple-500 opacity-60 group-hover:opacity-100 transition-opacity" />

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500/20 to-purple-500/20 border border-brand-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-brand-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm leading-tight">
                  {edu.degree || 'Degree not specified'}
                </p>
                <p className="text-brand-300 text-sm mt-0.5">
                  {edu.institution || 'Institution not specified'}
                </p>
                {edu.year && (
                  <span className="inline-block mt-2 text-xs text-slate-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                    Class of {edu.year}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
