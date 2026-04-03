import { NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="nav-bar" id="main-navbar">
      {/* Brand */}
      <NavLink to="/" className="nav-brand">
        <div className="nav-brand-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a9 9 0 019 9c0 3.87-3.13 7-7 7h-4a7 7 0 01-7-7 9 9 0 019-9z" />
            <path d="M12 8v4" />
            <path d="M9.5 11.5l5-3" />
            <path d="M9.5 11.5l5 3" />
          </svg>
        </div>
        <span className="nav-brand-text">Resume<span>AI</span></span>
      </NavLink>

      {/* Center Links */}
      <div className="nav-links">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          id="nav-dashboard"
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/upload"
          className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          id="nav-upload"
        >
          Upload
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          id="nav-settings"
        >
          Settings
        </NavLink>
      </div>

      {/* Right Actions */}
      <div className="nav-actions">
        <span className="nav-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          Powered by Gemini
        </span>
        <div className="nav-avatar" id="user-avatar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
      </div>
    </nav>
  )
}
