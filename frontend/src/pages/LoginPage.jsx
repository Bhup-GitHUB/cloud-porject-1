import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-white">
      <aside className="hidden w-1/2 flex-col justify-between bg-slate-900 p-12 lg:flex">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M6.5 18.5A4.5 4.5 0 0 1 6 9.55a6 6 0 0 1 11.55 1.4A3.75 3.75 0 0 1 17 18.5z" />
              <path d="M12 11.75v3.5" />
            </svg>
          </span>
          <span className="text-lg font-semibold tracking-tight text-white">
            CloudVault
          </span>
        </div>

        <div className="max-w-md">
          <h2 className="text-3xl font-semibold leading-tight tracking-tight text-white">
            A secure analytical platform for eCommerce, built on AWS.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            Versioned file storage backed by Amazon S3 with cross-region backup
            replication, paired with a personalized product ranking engine.
          </p>
        </div>

        <dl className="grid grid-cols-3 gap-6 border-t border-slate-800 pt-8">
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">
              Storage
            </dt>
            <dd className="mt-1 text-sm font-medium text-slate-200">
              Amazon S3
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">
              History
            </dt>
            <dd className="mt-1 text-sm font-medium text-slate-200">
              Versioned
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">
              Backup
            </dt>
            <dd className="mt-1 text-sm font-medium text-slate-200">
              Replicated
            </dd>
          </div>
        </dl>
      </aside>

      <main className="flex w-full items-center justify-center bg-slate-50 px-4 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M6.5 18.5A4.5 4.5 0 0 1 6 9.55a6 6 0 0 1 11.55 1.4A3.75 3.75 0 0 1 17 18.5z" />
                <path d="M12 11.75v3.5" />
              </svg>
            </span>
            <span className="text-lg font-semibold tracking-tight text-slate-900">
              CloudVault
            </span>
          </div>

          <div className="surface p-8">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Sign in
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Welcome back. Enter your details to continue.
            </p>

            {error && (
              <div
                role="alert"
                className="mt-6 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label htmlFor="login-email" className="field-label">
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="field-input"
                />
              </div>
              <div>
                <label htmlFor="login-password" className="field-label">
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="field-input"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-2.5"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-slate-600">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="rounded font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
