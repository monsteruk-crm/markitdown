'use client'

import { useState, useCallback, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { 
  Upload, 
  Link, 
  FileText, 
  Loader2, 
  Copy, 
  Check, 
  Download,
  AlertCircle,
  FileType
} from 'lucide-react'

interface ConversionResult {
  filename?: string
  url?: string
  markdown: string
  title: string
}

interface SupportedFormats {
  documents: string[]
  web: string[]
  data: string[]
  images: string[]
  audio: string[]
  archives: string[]
  ebooks: string[]
  other: string[]
}

export default function Home() {
  const [result, setResult] = useState<ConversionResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [url, setUrl] = useState('')
  const [activeTab, setActiveTab] = useState<'file' | 'url'>('file')
  const [formats, setFormats] = useState<SupportedFormats | null>(null)
  const [showFormats, setShowFormats] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(async (file: File) => {
    setLoading(true)
    setError(null)
    setResult(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail || 'Conversion failed')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleUrlConvert = useCallback(async () => {
    if (!url.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch(`/api/convert-url?url=${encodeURIComponent(url)}`, {
        method: 'POST',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail || 'Conversion failed')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [url])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [handleFile])

  const copyToClipboard = useCallback(async () => {
    if (!result?.markdown) return
    
    await navigator.clipboard.writeText(result.markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [result])

  const downloadMarkdown = useCallback(() => {
    if (!result?.markdown) return
    
    const blob = new Blob([result.markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${result.title || 'converted'}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [result])

  const loadFormats = useCallback(async () => {
    if (formats) {
      setShowFormats(!showFormats)
      return
    }
    
    try {
      const response = await fetch('/api/supported-formats')
      const data = await response.json()
      setFormats(data)
      setShowFormats(true)
    } catch {
      // Silently fail
    }
  }, [formats, showFormats])

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-[var(--foreground)]">
            MarkItDown
          </h1>
          <p className="text-[var(--muted-foreground)] text-lg">
            Convert documents to Markdown using Microsoft MarkItDown
          </p>
          <button
            onClick={loadFormats}
            className="mt-3 inline-flex items-center gap-2 text-sm text-[var(--accent)] hover:underline"
          >
            <FileType className="w-4 h-4" />
            View supported formats
          </button>
        </div>

        {/* Supported Formats */}
        {showFormats && formats && (
          <div className="mb-8 p-4 bg-[var(--muted)] rounded-xl border border-[var(--border)]">
            <h3 className="font-semibold mb-3 text-[var(--foreground)]">Supported Formats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {Object.entries(formats).map(([category, exts]) => (
                <div key={category}>
                  <p className="font-medium capitalize text-[var(--foreground)] mb-1">{category}</p>
                  <p className="text-[var(--muted-foreground)]">{exts.join(', ')}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('file')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'file'
                ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            }`}
          >
            <Upload className="w-4 h-4" />
            Upload File
          </button>
          <button
            onClick={() => setActiveTab('url')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'url'
                ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            }`}
          >
            <Link className="w-4 h-4" />
            Convert URL
          </button>
        </div>

        {/* Input Section */}
        <div className="mb-8">
          {activeTab === 'file' ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
                dragActive
                  ? 'border-[var(--accent)] bg-[var(--accent)]/10'
                  : 'border-[var(--border)] hover:border-[var(--muted-foreground)]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                className="hidden"
              />
              <Upload className="w-12 h-12 mx-auto mb-4 text-[var(--muted-foreground)]" />
              <p className="text-[var(--foreground)] font-medium mb-1">
                Drop a file here or click to upload
              </p>
              <p className="text-sm text-[var(--muted-foreground)]">
                PDF, Word, PowerPoint, Excel, HTML, images, and more
              </p>
            </div>
          ) : (
            <div className="flex gap-3">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL (webpage, YouTube video, or direct file link)"
                className="flex-1 px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                onKeyDown={(e) => e.key === 'Enter' && handleUrlConvert()}
              />
              <button
                onClick={handleUrlConvert}
                disabled={loading || !url.trim()}
                className="px-6 py-3 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                Convert
              </button>
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center gap-3 py-12">
            <Loader2 className="w-6 h-6 animate-spin text-[var(--accent)]" />
            <span className="text-[var(--muted-foreground)]">Converting...</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl mb-8">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-500">Conversion Failed</p>
              <p className="text-sm text-red-400">{error}</p>
            </div>
          </div>
        )}

        {/* Result */}
        {result && !loading && (
          <div className="border border-[var(--border)] rounded-xl overflow-hidden">
            {/* Result Header */}
            <div className="flex items-center justify-between p-4 bg-[var(--muted)] border-b border-[var(--border)]">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[var(--muted-foreground)]" />
                <span className="font-medium text-[var(--foreground)]">{result.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-[var(--background)] border border-[var(--border)] hover:bg-[var(--muted)] transition-colors text-[var(--foreground)]"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
                <button
                  onClick={downloadMarkdown}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-[var(--background)] border border-[var(--border)] hover:bg-[var(--muted)] transition-colors text-[var(--foreground)]"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>

            {/* Markdown Preview */}
            <div className="p-6 max-h-[600px] overflow-y-auto">
              <div className="markdown-body">
                <ReactMarkdown>{result.markdown}</ReactMarkdown>
              </div>
            </div>

            {/* Raw Markdown Toggle */}
            <details className="border-t border-[var(--border)]">
              <summary className="p-4 cursor-pointer text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                View raw Markdown
              </summary>
              <pre className="p-4 bg-[var(--muted)] text-sm overflow-x-auto text-[var(--foreground)] font-mono">
                {result.markdown}
              </pre>
            </details>
          </div>
        )}
      </div>
    </main>
  )
}
