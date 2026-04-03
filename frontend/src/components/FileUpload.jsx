import { useState, useRef, useCallback } from 'react'

const ACCEPTED_TYPES = ['.pdf', '.docx']

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export default function FileUpload({ onUpload, isLoading }) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileError, setFileError] = useState('')
  const inputRef = useRef(null)

  const validateFile = (file) => {
    const ext = '.' + file.name.split('.').pop().toLowerCase()
    if (!ACCEPTED_TYPES.includes(ext)) {
      return `Unsupported file type "${ext}". Please upload a .pdf or .docx file.`
    }
    if (file.size > 10 * 1024 * 1024) {
      return 'File size exceeds 10 MB. Please upload a smaller file.'
    }
    if (file.size === 0) {
      return 'The selected file is empty.'
    }
    return null
  }

  const handleFile = useCallback((file) => {
    setFileError('')
    const error = validateFile(file)
    if (error) {
      setFileError(error)
      setSelectedFile(null)
      return
    }
    setSelectedFile(file)
  }, [])

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true)
    else if (e.type === 'dragleave') setDragActive(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleInputChange = (e) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleSubmit = () => {
    if (selectedFile && !isLoading) {
      onUpload(selectedFile)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setFileError('')
    if (inputRef.current) inputRef.current.value = ''
  }

  const fileExt = selectedFile ? selectedFile.name.split('.').pop().toUpperCase() : null

  return (
    <div className="w-full">
      {/* Drop Zone */}
      <div
        id="drop-zone"
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => !isLoading && inputRef.current?.click()}
        className={`upload-zone ${dragActive ? 'drag-active' : ''} ${isLoading ? 'disabled' : ''}`}
      >
        <input
          ref={inputRef}
          type="file"
          id="resume-file-input"
          accept=".pdf,.docx"
          className="hidden"
          onChange={handleInputChange}
          disabled={isLoading}
        />

        {/* Icons */}
        <div className="upload-icon-container">
          <span className="upload-icon-plus">+</span>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>

        <p className="upload-title">
          {dragActive ? 'Drop your resume here' : 'Drag & drop your resume or click to browse files.'}
        </p>
        <p className="upload-subtitle">Supported formats: .pdf, .docx. Max file size: 10MB.</p>
      </div>

      {/* Error message */}
      {fileError && (
        <div id="file-error" className="error-banner mt-3 animate-fade-in">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span className="text-sm" style={{ color: 'var(--accent-red)' }}>{fileError}</span>
        </div>
      )}

      {/* Selected file info */}
      {selectedFile && !fileError && (
        <div id="selected-file-info" className="file-info-bar animate-fade-in">
          <div className="flex items-center gap-3">
            <span className={`file-type-badge ${fileExt === 'PDF' ? 'pdf' : 'docx'}`}>
              {fileExt}
            </span>
            <div>
              <p className="text-sm font-medium truncate max-w-xs" style={{ color: 'var(--text-primary)' }}>{selectedFile.name}</p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{formatFileSize(selectedFile.size)}</p>
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); handleRemoveFile() }}
            className="p-1 rounded-lg transition-colors"
            style={{ color: 'var(--text-tertiary)' }}
            aria-label="Remove file"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Analyze Button */}
      {selectedFile && !fileError && (
        <div className="mt-4 flex justify-center">
          <button
            id="parse-resume-btn"
            onClick={handleSubmit}
            disabled={isLoading}
            className="btn-analyze"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Analyzing…
              </>
            ) : (
              'Analyze Resume'
            )}
          </button>
        </div>
      )}

      {/* If no file selected, show standalone button */}
      {!selectedFile && !fileError && (
        <div className="mt-4 flex justify-center">
          <button
            id="browse-resume-btn"
            onClick={() => !isLoading && inputRef.current?.click()}
            disabled={isLoading}
            className="btn-analyze"
          >
            Analyze Resume
          </button>
        </div>
      )}
    </div>
  )
}
