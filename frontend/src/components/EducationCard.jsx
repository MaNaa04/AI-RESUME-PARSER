export default function EducationCard({ education }) {
  if (!education || education.length === 0) {
    return (
      <div className="card" id="education-card">
        <h3 className="card-title">Education</h3>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>No education details found in this resume.</p>
      </div>
    )
  }

  return (
    <div className="card animate-slide-up" id="education-card">
      <h3 className="card-title">Education</h3>
      <div className="flex flex-col gap-3">
        {education.map((edu, index) => (
          <div key={index} id={`education-item-${index}`} className="edu-item">
            <div className="edu-icon">
              <svg width="12" height="12" viewBox="0 0 20 20" fill="var(--accent-green)">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="edu-degree">{edu.degree || 'Degree not specified'}</p>
              <p className="edu-institution">
                {edu.institution || 'Institution not specified'}
                {edu.year ? `, ${edu.year}` : ''}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
