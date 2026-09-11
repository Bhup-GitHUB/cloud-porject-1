import api from '../api/axios'

function formatSize(bytes) {
  if (bytes === undefined || bytes === null) return '-'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(dateString) {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString()
}

export default function FilesTable({ files, onRefresh, onViewVersions }) {
  const handleDownload = async (file) => {
    const { data } = await api.get(`/files/${file.id}/download`)
    window.open(data.url, '_blank')
  }

  const handleDelete = async (file) => {
    if (!window.confirm(`Delete "${file.filename}"?`)) return
    await api.delete(`/files/${file.id}`)
    onRefresh?.()
  }

  if (!files.length) {
    return (
      <p className="text-gray-500 text-center py-8">No files uploaded yet.</p>
    )
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Filename
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Version
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Size
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {files.map((file) => (
            <tr key={file.id}>
              <td className="px-4 py-3 text-sm text-gray-900">
                {file.filename}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {file.version}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {formatSize(file.size)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {formatDate(file.createdAt)}
              </td>
              <td className="px-4 py-3 text-sm space-x-3">
                <button
                  onClick={() => handleDownload(file)}
                  className="text-blue-600 hover:underline"
                >
                  Download
                </button>
                <button
                  onClick={() => onViewVersions(file)}
                  className="text-gray-600 hover:underline"
                >
                  Versions
                </button>
                <button
                  onClick={() => handleDelete(file)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
