import { useState, useRef, useCallback } from 'react'

const ACCEPTED_TYPES = ['.pdf', '.docx']
const ACCEPTED_MIME = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

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
  const extColor = fileExt === 'PDF'
    ? 'from-red-500/20 to-red-600/20 border-red-500/30 text-red-300'
    : 'from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-300'

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Drop Zone */}
      <div
        id="drop-zone"
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => !isLoading && inputRef.current?.click()}
        className={`
          relative cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center
          transition-all duration-300 select-none
          ${dragActive
            ? 'border-brand-400 bg-brand-500/10 scale-[1.01]'
            : 'border-white/20 hover:border-brand-400/60 hover:bg-white/5'
          }
          ${isLoading ? 'cursor-not-allowed opacity-60' : ''}
        `}
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

        {/* Icon */}
        <div className={`
          mx-auto mb-4 w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300
          ${dragActive ? 'bg-brand-500/30 scale-110' : 'bg-white/5'}
        `}>
          <svg className={`w-8 h-8 ${dragActive ? 'text-brand-300' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>

        <p className="text-white font-semibold text-lg mb-1">
          {dragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
        </p>
        <p className="text-slate-400 text-sm mb-3">or click to browse files</p>
        <div className="flex justify-center gap-2">
          {['PDF', 'DOCX'].map(fmt => (
            <span key={fmt} className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-slate-300">
              .{fmt.toLowerCase()}
            </span>
          ))}
        </div>
        <p className="text-slate-500 text-xs mt-2">Max file size: 10 MB</p>
      </div>

      {/* Error message */}
      {fileError && (
        <div id="file-error" className="mt-3 flex items-start gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm animate-fade-in">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {fileError}
        </div>
      )}

      {/* Selected file info */}
      {selectedFile && !fileError && (
        <div id="selected-file-info" className="mt-3 flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/10 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className={`px-2 py-1 rounded-lg text-xs font-bold bg-gradient-to-r ${extColor} border`}>
              {fileExt}
            </div>
            <div>
              <p className="text-white text-sm font-medium truncate max-w-xs">{selectedFile.name}</p>
              <p className="text-slate-400 text-xs">{formatFileSize(selectedFile.size)}</p>
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); handleRemoveFile() }}
            className="text-slate-400 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-500/10"
            aria-label="Remove file"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Submit button */}
      {selectedFile && !fileError && (
        <button
          id="parse-resume-btn"
          onClick={handleSubmit}
          disabled={isLoading}
          className={`
            mt-4 w-full py-4 rounded-xl font-semibold text-white text-base
            transition-all duration-200 flex items-center justify-center gap-3
            ${isLoading
              ? 'opacity-60 cursor-not-allowed bg-brand-600'
              : 'btn-primary'
            }
          `}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Analyzing Resume...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Analyze with Gemini AI
            </>
          )}
        </button>
      )}
    </div>
  )
}
