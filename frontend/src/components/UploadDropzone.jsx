import { useRef, useState } from 'react'
import api from '../api/axios'

export default function UploadDropzone({ onUploaded }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const uploadFile = async (file) => {
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      onUploaded?.()
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files?.[0]
    uploadFile(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragActive(false)
  }

  const handleChange = (e) => {
    const file = e.target.files?.[0]
    uploadFile(file)
    e.target.value = ''
  }

  const stateClass = uploading
    ? 'border-indigo-300 bg-indigo-50/40 cursor-wait'
    : dragActive
      ? 'border-indigo-500 bg-indigo-50 ring-4 ring-indigo-500/10 scale-[1.005]'
      : 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-slate-50'

  return (
    <div
      onClick={() => !uploading && inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition-all duration-150 ${
        uploading ? '' : 'cursor-pointer'
      } ${stateClass}`}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleChange}
      />

      {uploading ? (
        <>
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="h-6 w-6 animate-spin"
              aria-hidden="true"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          </span>
          <p className="mt-4 text-sm font-medium text-slate-900">
            Uploading your file
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Sending to Amazon S3 and creating a new version
          </p>
        </>
      ) : (
        <>
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors duration-150 ${
              dragActive
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <path d="M12 3v13" />
              <path d="m7 8 5-5 5 5" />
            </svg>
          </span>
          <p className="mt-4 text-sm font-medium text-slate-900">
            {dragActive ? 'Drop to upload' : 'Drag and drop a file here'}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {dragActive
              ? 'Release the file to start the upload'
              : 'or click anywhere in this area to browse'}
          </p>
          <span className="mt-5 inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            Uploading an existing filename creates a new version
          </span>
        </>
      )}
    </div>
  )
}
