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
    <div className="min-h-screen bg-gray-100">
      <AppHeader />

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
