import { useState } from 'react'
import axios from 'axios'
import FileUpload from './components/FileUpload'
import SkillsCard from './components/SkillsCard'
import ExperienceCard from './components/ExperienceCard'
import EducationCard from './components/EducationCard'
import StrengthReport from './components/StrengthReport'

// ── Skeleton loader shown while awaiting Gemini response ──────────────────
function SkeletonLoader() {
  return (
    <div id="skeleton-loader" className="space-y-4 animate-fade-in">
      <p className="text-center text-slate-400 text-sm mb-6 flex items-center justify-center gap-2">
        <svg className="animate-spin w-4 h-4 text-brand-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Gemini is analyzing your resume…
      </p>

      {[
        { title: '🛠️ Skills & Technologies', rows: [1] },
        { title: '💼 Work Experience', rows: [1, 2] },
        { title: '🎓 Education', rows: [1] },
        { title: '💪 Strength Report', rows: [1, 2] },
      ].map(({ title, rows }) => (
        <div key={title} className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="skeleton h-5 w-40 rounded-md" />
          </div>
          {rows.map((r) => (
            <div key={r} className="skeleton h-10 w-full rounded-xl mb-2" />
          ))}
          <div className="skeleton h-6 w-2/3 rounded-md mt-1" />
        </div>
      ))}
    </div>
  )
}

// ── Error banner ──────────────────────────────────────────────────────────
function ErrorBanner({ message, onDismiss }) {
  return (
    <div id="error-banner" className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/25 animate-fade-in">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
        <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="flex-1">
        <p className="text-red-300 font-semibold text-sm">Analysis Failed</p>
        <p className="text-red-400/80 text-sm mt-0.5">{message}</p>
      </div>
      <button
        onClick={onDismiss}
        className="flex-shrink-0 text-red-400 hover:text-red-200 transition-colors"
        aria-label="Dismiss error"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

// ── Results Dashboard ─────────────────────────────────────────────────────
function ResultsDashboard({ insights, onReset }) {
  return (
    <div id="results-dashboard" className="animate-fade-in">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white font-bold text-xl">Analysis Complete</h2>
          <p className="text-slate-400 text-sm">Powered by Google Gemini AI</p>
        </div>
        <button
          id="analyze-another-btn"
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                     text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10
                     hover:border-white/20 transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Analyze Another
        </button>
      </div>

      <div className="space-y-4">
        <StrengthReport report={insights.candidate_strength_report} />
        <SkillsCard skills={insights.skills_and_technologies} />
        <ExperienceCard experiences={insights.work_experience_summary} />
        <EducationCard education={insights.education} />
      </div>
    </div>
  )
}

// ── Root App ──────────────────────────────────────────────────────────────
export default function App() {
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'success' | 'error'
  const [insights, setInsights] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  const handleUpload = async (file) => {
    setStatus('loading')
    setErrorMessage('')
    setInsights(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post('/api/parse-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000, // 60s for large PDFs + Gemini latency
      })
      setInsights(response.data)
      setStatus('success')
    } catch (err) {
      const detail =
        err?.response?.data?.detail ||
        err?.message ||
        'An unexpected error occurred. Please try again.'
      setErrorMessage(detail)
      setStatus('error')
    }
  }

  const handleReset = () => {
    setStatus('idle')
    setInsights(null)
    setErrorMessage('')
  }

  const showUpload = status === 'idle' || status === 'error'

  return (
    <div className="min-h-screen px-4 py-12">
      {/* ── Page header ── */}
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold mb-4 tracking-wide uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          Powered by Google Gemini AI
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 leading-tight tracking-tight">
          AI{' '}
          <span className="gradient-text">Resume Parser</span>
        </h1>

        <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          Upload your resume and get instant, structured insights — skills, experience, education, and a
          detailed strength report.
        </p>
      </header>

      {/* ── Main content ── */}
      <main className="max-w-3xl mx-auto">
        {/* Upload + error area */}
        {showUpload && (
          <section className="glass-card p-6 sm:p-8 mb-6 animate-fade-in">
            <h2 className="text-white font-semibold text-base mb-5 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-300 text-xs font-bold">1</span>
              Upload Your Resume
            </h2>

            <FileUpload onUpload={handleUpload} isLoading={status === 'loading'} />

            {status === 'error' && (
              <div className="mt-4">
                <ErrorBanner message={errorMessage} onDismiss={handleReset} />
              </div>
            )}
          </section>
        )}

        {/* Skeleton while loading */}
        {status === 'loading' && (
          <div className="glass-card p-6 sm:p-8">
            <SkeletonLoader />
          </div>
        )}

        {/* Results */}
        {status === 'success' && insights && (
          <ResultsDashboard insights={insights} onReset={handleReset} />
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="text-center mt-16 text-slate-600 text-xs">
        <p>AI Resume Parser · Built with React + FastAPI + Google Gemini</p>
      </footer>
    </div>
  )
}
