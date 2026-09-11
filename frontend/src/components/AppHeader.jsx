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
      ? 'text-sm font-semibold text-blue-600'
      : 'text-sm text-gray-600 hover:text-gray-900'

  return (
    <header className="bg-white shadow">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-semibold text-gray-900">
            Secure Cloud Files
          </h1>
          <nav className="flex items-center gap-4">
            <NavLink to="/" end className={navLinkClass}>
              Files
            </NavLink>
            <NavLink to="/products" className={navLinkClass}>
              Products
            </NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <span className="text-sm text-gray-600">{user.email}</span>
          )}
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:underline"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
