export default function DocsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">MarkItDown API Documentation</h1>
          <p className="text-zinc-400 text-lg">
            A Python service powered by Microsoft MarkItDown for converting documents to Markdown.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">Project Structure</h2>
          <pre className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 overflow-x-auto text-sm">
{`/
├── vercel.json              # Services configuration (routes /api/* to backend)
├── backend/
│   ├── main.py              # FastAPI application with MarkItDown integration
│   └── pyproject.toml       # Python dependencies (markitdown[pdf], fastapi)
└── frontend/
    ├── app/
    │   ├── page.tsx         # Main file upload/URL conversion UI
    │   ├── docs/page.tsx    # This documentation page
    │   ├── layout.tsx       # Root layout
    │   └── globals.css      # Tailwind CSS styles
    ├── package.json
    └── next.config.ts`}
          </pre>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">API Endpoints</h2>
          
          <div className="space-y-8">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">POST</span>
                <code className="text-emerald-400 font-mono">/api/convert</code>
              </div>
              <p className="text-zinc-300 mb-4">Upload a file to convert to Markdown.</p>
              <h4 className="text-sm font-semibold text-zinc-400 mb-2">Request</h4>
              <pre className="bg-zinc-950 rounded p-3 text-sm mb-4 overflow-x-auto">
{`Content-Type: multipart/form-data

FormData:
  - file: File (required) - The document to convert`}
              </pre>
              <h4 className="text-sm font-semibold text-zinc-400 mb-2">Response (200 OK)</h4>
              <pre className="bg-zinc-950 rounded p-3 text-sm overflow-x-auto">
{`{
  "success": true,
  "markdown": "# Document Title\\n\\nContent here...",
  "filename": "document.pdf",
  "title": "Document Title"
}`}
              </pre>
              <h4 className="text-sm font-semibold text-zinc-400 mb-2 mt-4">Example (curl)</h4>
              <pre className="bg-zinc-950 rounded p-3 text-sm overflow-x-auto">
{`curl -X POST \\
  -F "file=@document.pdf" \\
  https://your-domain.vercel.app/api/convert`}
              </pre>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">POST</span>
                <code className="text-emerald-400 font-mono">/api/convert-url</code>
              </div>
              <p className="text-zinc-300 mb-4">Convert a URL (webpage, YouTube video, etc.) to Markdown.</p>
              <h4 className="text-sm font-semibold text-zinc-400 mb-2">Query Parameters</h4>
              <pre className="bg-zinc-950 rounded p-3 text-sm mb-4 overflow-x-auto">
{`url: string (required) - The URL to convert`}
              </pre>
              <h4 className="text-sm font-semibold text-zinc-400 mb-2">Response (200 OK)</h4>
              <pre className="bg-zinc-950 rounded p-3 text-sm overflow-x-auto">
{`{
  "success": true,
  "markdown": "# Page Title\\n\\nExtracted content...",
  "url": "https://example.com/page",
  "title": "Page Title"
}`}
              </pre>
              <h4 className="text-sm font-semibold text-zinc-400 mb-2 mt-4">Example (curl)</h4>
              <pre className="bg-zinc-950 rounded p-3 text-sm overflow-x-auto">
{`curl -X POST \\
  "https://your-domain.vercel.app/api/convert-url?url=https://example.com"`}
              </pre>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">GET</span>
                <code className="text-emerald-400 font-mono">/api/supported-formats</code>
              </div>
              <p className="text-zinc-300 mb-4">Returns a list of all supported file formats and their descriptions.</p>
              <h4 className="text-sm font-semibold text-zinc-400 mb-2">Response (200 OK)</h4>
              <pre className="bg-zinc-950 rounded p-3 text-sm overflow-x-auto">
{`{
  "formats": [
    { "extension": ".pdf", "description": "PDF documents", "mime_type": "application/pdf" },
    { "extension": ".docx", "description": "Microsoft Word", "mime_type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
    ...
  ]
}`}
              </pre>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">GET</span>
                <code className="text-emerald-400 font-mono">/api/health</code>
              </div>
              <p className="text-zinc-300 mb-4">Health check endpoint for monitoring.</p>
              <h4 className="text-sm font-semibold text-zinc-400 mb-2">Response (200 OK)</h4>
              <pre className="bg-zinc-950 rounded p-3 text-sm overflow-x-auto">
{`{
  "status": "ok",
  "service": "markitdown",
  "version": "1.0.0"
}`}
              </pre>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">Supported File Formats</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { ext: '.pdf', desc: 'PDF documents (requires markitdown[pdf])' },
              { ext: '.docx', desc: 'Microsoft Word documents' },
              { ext: '.pptx', desc: 'Microsoft PowerPoint presentations' },
              { ext: '.xlsx', desc: 'Microsoft Excel spreadsheets' },
              { ext: '.html/.htm', desc: 'HTML web pages' },
              { ext: '.csv', desc: 'Comma-separated values' },
              { ext: '.json', desc: 'JSON data files' },
              { ext: '.xml', desc: 'XML documents' },
              { ext: '.txt/.md', desc: 'Plain text and Markdown' },
              { ext: '.jpg/.png/.gif', desc: 'Images (extracts EXIF metadata)' },
              { ext: '.mp3/.wav', desc: 'Audio files (extracts metadata)' },
              { ext: '.zip', desc: 'ZIP archives (processes contents)' },
            ].map((format) => (
              <div key={format.ext} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <code className="text-emerald-400 font-mono text-sm">{format.ext}</code>
                <p className="text-zinc-400 text-sm mt-1">{format.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">URL Conversion</h2>
          <p className="text-zinc-300 mb-4">The URL conversion endpoint supports:</p>
          <ul className="list-disc list-inside text-zinc-400 space-y-2">
            <li>Standard web pages (extracts main content as Markdown)</li>
            <li>YouTube videos (extracts video metadata and transcript if available)</li>
            <li>Direct links to supported file types (PDF, DOCX, etc.)</li>
            <li>Wikipedia articles</li>
            <li>RSS feeds</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">Error Handling</h2>
          <p className="text-zinc-300 mb-4">All endpoints return errors in a consistent format:</p>
          <pre className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-sm overflow-x-auto">
{`{
  "success": false,
  "error": "Error message describing what went wrong"
}

HTTP Status Codes:
- 200: Success
- 400: Bad request (missing file, invalid URL, etc.)
- 500: Server error (conversion failed, dependency missing, etc.)`}
          </pre>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">Configuration</h2>
          <h3 className="text-lg font-semibold text-zinc-200 mb-3">Adding More Format Support</h3>
          <p className="text-zinc-300 mb-4">
            Edit <code className="text-emerald-400">backend/pyproject.toml</code> to add optional dependencies:
          </p>
          <pre className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-sm overflow-x-auto">
{`# Current configuration
"markitdown[pdf]>=0.1.6"

# To add more format support:
"markitdown[pdf,docx,pptx,xlsx]>=0.1.6"

# Or install all optional dependencies:
"markitdown[all]>=0.1.6"`}
          </pre>
          <p className="text-zinc-400 text-sm mt-4">
            Note: <code className="text-emerald-400">markitdown[all]</code> may have dependency conflicts. 
            Use specific extras like <code className="text-emerald-400">[pdf,docx]</code> for more reliable builds.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">Deployment Notes</h2>
          <ul className="list-disc list-inside text-zinc-400 space-y-2">
            <li>Framework Preset must be set to <strong className="text-white">Services</strong> in Vercel project settings</li>
            <li>The backend runs on Vercel Serverless Functions with Python runtime</li>
            <li>File uploads are limited by Vercel&apos;s payload size limits (4.5MB for serverless)</li>
            <li>For larger files, consider using Vercel Blob storage for upload handling</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">Links</h2>
          <ul className="space-y-2">
            <li>
              <a 
                href="https://github.com/microsoft/markitdown" 
                className="text-emerald-400 hover:text-emerald-300 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Microsoft MarkItDown GitHub Repository
              </a>
            </li>
            <li>
              <a 
                href="https://vercel.com/docs/functions/runtimes/python" 
                className="text-emerald-400 hover:text-emerald-300 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Vercel Python Runtime Documentation
              </a>
            </li>
            <li>
              <a 
                href="/" 
                className="text-emerald-400 hover:text-emerald-300 underline"
              >
                Back to Converter UI
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  )
}
