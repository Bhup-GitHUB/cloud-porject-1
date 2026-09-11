import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import UploadDropzone from '../components/UploadDropzone'
import FilesTable from '../components/FilesTable'
import VersionsModal from '../components/VersionsModal'

export default function DashboardPage() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const fetchFiles = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/files')
      setFiles(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  const handleViewVersions = (file) => {
    setSelectedFile(file)
    setModalOpen(true)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">
            Secure Cloud Files
          </h1>
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

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <UploadDropzone onUploaded={fetchFiles} />

        {loading ? (
          <p className="text-gray-500 text-center py-8">Loading files...</p>
        ) : (
          <FilesTable
            files={files}
            onRefresh={fetchFiles}
            onViewVersions={handleViewVersions}
          />
        )}
      </main>

      <VersionsModal
        file={selectedFile}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onRestored={fetchFiles}
      />
    </div>
  )
}
