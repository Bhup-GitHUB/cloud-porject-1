import { useEffect, useState } from 'react'
import api from '../api/axios'
import AppHeader from '../components/AppHeader'
import UploadDropzone from '../components/UploadDropzone'
import FilesTable from '../components/FilesTable'
import VersionsModal from '../components/VersionsModal'

export default function DashboardPage() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

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

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Secure file storage
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-slate-500">
            Files are stored in Amazon S3 with versioning enabled and replicated
            to a backup bucket. Any earlier version can be restored at any time.
          </p>
        </div>

        <div className="space-y-6">
          <UploadDropzone onUploaded={fetchFiles} />

          {loading ? (
            <div className="surface flex flex-col items-center justify-center px-6 py-16 text-center">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />
              <p className="mt-4 text-sm text-slate-500">Loading files...</p>
            </div>
          ) : (
            <FilesTable
              files={files}
              onRefresh={fetchFiles}
              onViewVersions={handleViewVersions}
            />
          )}
        </div>
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
