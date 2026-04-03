import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from './components/Navbar'
import DashboardPage from './pages/DashboardPage'
import StrengthDeepDivePage from './pages/StrengthDeepDivePage'

// In production (Vercel), VITE_API_URL points to the Render backend.
// In local dev, it falls back to '' so the Vite proxy handles /api/* calls.
const API_BASE = import.meta.env.VITE_API_URL || ''

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
      const response = await axios.post(`${API_BASE}/api/parse-resume`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000,
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

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <DashboardPage
              status={status}
              insights={insights}
              errorMessage={errorMessage}
              onUpload={handleUpload}
              onReset={handleReset}
            />
          }
        />
        <Route
          path="/upload"
          element={
            <DashboardPage
              status={status}
              insights={insights}
              errorMessage={errorMessage}
              onUpload={handleUpload}
              onReset={handleReset}
            />
          }
        />
        <Route
          path="/deep-dive"
          element={<StrengthDeepDivePage insights={insights} />}
        />
        <Route
          path="/settings"
          element={
            <div className="p-8 text-center animate-fade-in">
              <div className="card" style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
                <h3 className="card-title" style={{ textAlign: 'center' }}>Settings</h3>
                <p style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>
                  Settings page coming soon.
                </p>
              </div>
            </div>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
