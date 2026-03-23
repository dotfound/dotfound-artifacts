import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#002040] flex items-center justify-center">
      <div className="text-center">
        <p className="text-[#cee4ff] text-sm font-light mb-4">Artefact not found.</p>
        <Link
          href="/"
          className="text-white text-xs underline underline-offset-2 hover:text-[#cee4ff] transition-colors"
        >
          Back to library
        </Link>
      </div>
    </main>
  )
}
