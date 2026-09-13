import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AppHeader() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navLinkClass = ({ isActive }) =>
    isActive
      ? 'rounded-lg px-3 py-1.5 text-sm font-semibold text-indigo-700 bg-indigo-50 transition-colors duration-150'
      : 'rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors duration-150'

  const initial = user?.email ? user.email.charAt(0).toUpperCase() : '?'

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-3 sm:gap-8">
          <NavLink
            to="/"
            className="flex items-center gap-2.5 rounded-lg"
            aria-label="CloudVault home"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M6.5 18.5A4.5 4.5 0 0 1 6 9.55a6 6 0 0 1 11.55 1.4A3.75 3.75 0 0 1 17 18.5z" />
                <path d="M12 11.75v3.5" />
              </svg>
            </span>
            <span className="text-base font-semibold tracking-tight text-slate-900">
              CloudVault
            </span>
          </NavLink>

          <nav className="flex items-center gap-1">
            <NavLink to="/" end className={navLinkClass}>
              Files
            </NavLink>
            <NavLink to="/products" className={navLinkClass}>
              Products
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {user && (
            <div className="flex items-center gap-2">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold uppercase text-slate-600"
                aria-hidden="true"
              >
                {initial}
              </span>
              <span className="hidden max-w-[14rem] truncate text-sm text-slate-600 sm:block">
                {user.email}
              </span>
            </div>
          )}
          <button onClick={handleLogout} className="btn-secondary">
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
