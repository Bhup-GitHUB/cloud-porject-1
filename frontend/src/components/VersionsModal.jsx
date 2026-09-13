import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function VersionsModal({ file, isOpen, onClose, onRestored }) {
  const [versions, setVersions] = useState([])
  const [loading, setLoading] = useState(false)
  const [restoringVersion, setRestoringVersion] = useState(null)

  useEffect(() => {
    if (isOpen && file) {
      fetchVersions()
    }
  }, [isOpen, file])

  const fetchVersions = async () => {
    setLoading(true)
    try {
      const { data } = await api.get(`/files/${file.id}/versions`)
      setVersions(data)
    } finally {
      setLoading(false)
    }
  }

  const handleRestore = async (version) => {
    setRestoringVersion(version)
    try {
      await api.post(`/files/${file.id}/restore/${version}`)
      onRestored?.()
      onClose()
    } finally {
      setRestoringVersion(null)
    }
  }

  if (!isOpen || !file) return null

  const latestVersion = versions.reduce(
    (max, v) => (v.version > max ? v.version : max),
    0
  )

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="versions-modal-title"
    >
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div className="min-w-0">
            <h2
              id="versions-modal-title"
              className="text-base font-semibold tracking-tight text-slate-900"
            >
              Version history
            </h2>
            <p className="mt-0.5 truncate text-sm text-slate-500" title={file.filename}>
              {file.filename}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close version history"
            className="btn-ghost -mr-1.5 -mt-1 h-8 w-8 shrink-0 rounded-lg p-0"
          >
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
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-6 py-2">
          {loading ? (
            <p className="py-10 text-center text-sm text-slate-500">
              Loading...
            </p>
          ) : versions.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-500">
              No versions recorded for this file yet.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {versions.map((v) => {
                const isCurrent = v.version === latestVersion
                return (
                  <li
                    key={v.id}
                    className="flex items-center justify-between gap-4 py-3.5"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={`inline-flex h-8 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-semibold tabular-nums ${
                          isCurrent
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        v{v.version}
                      </span>
                      <div className="min-w-0">
                        <p className="flex items-center gap-2 text-sm font-medium text-slate-900">
                          Version {v.version}
                          {isCurrent && (
                            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                              Current
                            </span>
                          )}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {new Date(v.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {isCurrent ? (
                      <span className="shrink-0 text-xs font-medium text-slate-400">
                        Active version
                      </span>
                    ) : (
                      <button
                        onClick={() => handleRestore(v.version)}
                        disabled={restoringVersion === v.version}
                        className="btn-secondary shrink-0 px-2.5 py-1.5"
                      >
                        {restoringVersion === v.version
                          ? 'Restoring...'
                          : 'Restore'}
                      </button>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <p className="text-xs text-slate-500">
            Restoring copies an older version back as the newest one.
          </p>
          <button onClick={onClose} className="btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
