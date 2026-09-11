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

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Versions of {file.filename}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            Close
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {versions.map((v) => (
              <li
                key={v.id}
                className="py-3 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Version {v.version}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(v.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleRestore(v.version)}
                  disabled={restoringVersion === v.version}
                  className="text-sm text-blue-600 hover:underline disabled:opacity-50"
                >
                  {restoringVersion === v.version ? 'Restoring...' : 'Restore'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
