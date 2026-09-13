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
      <div className="surface flex flex-col items-center justify-center px-6 py-16 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
            aria-hidden="true"
          >
            <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
            <path d="M14 3v5h5" />
          </svg>
        </span>
        <h3 className="mt-4 text-sm font-semibold text-slate-900">
          No files yet
        </h3>
        <p className="mt-1 max-w-sm text-sm text-slate-500">
          Upload your first file using the area above. Every upload is stored in
          Amazon S3 and kept as a restorable version.
        </p>
      </div>
    )
  }

  return (
    <div className="surface overflow-hidden">
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-900">Your files</h2>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
          {files.length} {files.length === 1 ? 'file' : 'files'}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70">
              <th className="whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Filename
              </th>
              <th className="whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Version
              </th>
              <th className="whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Size
              </th>
              <th className="whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Date
              </th>
              <th className="whitespace-nowrap px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {files.map((file) => (
              <tr
                key={file.id}
                className="transition-colors duration-150 hover:bg-slate-50"
              >
                <td className="max-w-xs px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                        aria-hidden="true"
                      >
                        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
                        <path d="M14 3v5h5" />
                      </svg>
                    </span>
                    <span
                      className="truncate text-sm font-medium text-slate-900"
                      title={file.filename}
                    >
                      {file.filename}
                    </span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-5 py-3.5">
                  <span className="inline-flex items-center rounded-md border border-indigo-100 bg-indigo-50 px-2 py-0.5 text-xs font-semibold tabular-nums text-indigo-700">
                    v{file.version}
                  </span>
                </td>
                <td className="whitespace-nowrap px-5 py-3.5 text-sm tabular-nums text-slate-600">
                  {formatSize(file.size)}
                </td>
                <td className="whitespace-nowrap px-5 py-3.5 text-sm text-slate-500">
                  {formatDate(file.createdAt)}
                </td>
                <td className="whitespace-nowrap px-5 py-3.5">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => handleDownload(file)}
                      className="btn-secondary px-2.5 py-1.5"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => onViewVersions(file)}
                      className="btn-ghost px-2.5 py-1.5"
                    >
                      Versions
                    </button>
                    <button
                      onClick={() => handleDelete(file)}
                      className="btn-danger px-2.5 py-1.5"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
