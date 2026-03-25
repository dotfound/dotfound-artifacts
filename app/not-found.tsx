import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-[rgba(255,255,255,0.95)] text-6xl font-semibold tracking-tight mb-2">404</p>
        <p className="text-[rgba(255,255,255,0.4)] text-sm font-light mb-6">Artefact not found.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[#22D3EE] text-xs font-light hover:text-white transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to library
        </Link>
      </div>
    </main>
  )
}
