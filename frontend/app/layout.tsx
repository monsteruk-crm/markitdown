import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MarkItDown - Document to Markdown Converter',
  description: 'Convert PDF, Word, PowerPoint, Excel, HTML, and more to Markdown using Microsoft MarkItDown',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="bg-[var(--background)]">
      <body>{children}</body>
    </html>
  )
}
