'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Artefact {
  slug: string
  title: string
  type: string
  date: string
  has_password: boolean
}

const typeConfig: Record<string, { label: string; bg: string }> = {
  dashboard: { label: 'Dashboard', bg: 'bg-[rgba(34,211,238,0.12)]' },
  report: { label: 'Report', bg: 'bg-[rgba(206,228,255,0.12)]' },
  proposal: { label: 'Proposal', bg: 'bg-[rgba(255,255,255,0.08)]' },
  presentation: { label: 'Presentation', bg: 'bg-[rgba(255,107,107,0.12)]' },
  calculator: { label: 'Calculator', bg: 'bg-[rgba(34,211,238,0.12)]' },
  other: { label: 'Other', bg: 'bg-[rgba(255,255,255,0.06)]' },
}

function getTypeConfig(type: string) {
  return typeConfig[type] ?? typeConfig.other
}

export default function ArtefactGrid({ artefacts: initial }: { artefacts: Artefact[] }) {
  const [artefacts, setArtefacts] = useState(initial)
  const [confirmSlug, setConfirmSlug] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  async function handleDelete(slug: string) {
    setDeleting(true)
    try {
      const res = await fetch(`/api/artefacts/${slug}`, { method: 'DELETE' })
      if (res.ok) {
        setArtefacts((prev) => prev.filter((a) => a.slug !== slug))
        setConfirmSlug(null)
      }
    } finally {
      setDeleting(false)
    }
  }

  if (artefacts.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-[rgba(255,255,255,0.3)] text-sm font-light">No artefacts published yet.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {artefacts.map((a, i) => {
        const tc = getTypeConfig(a.type)
        const isConfirming = confirmSlug === a.slug

        return (
          <div
            key={a.slug}
            className="animate-in group relative rounded-lg overflow-hidden border border-[rgba(255,255,255,0.09)] bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.07)] hover:border-[rgba(167,139,250,0.3)] transition-all duration-300"
            style={{ animationDelay: `${i * 0.06}s` }}
          >
            {/* Live iframe preview */}
            <div className="relative w-full aspect-[16/10] overflow-hidden bg-[rgba(0,0,0,0.2)]">
              <iframe
                src={`/a/${a.slug}.html`}
                title={a.title}
                className="w-[200%] h-[200%] origin-top-left pointer-events-none"
                style={{ transform: 'scale(0.5)' }}
                loading="lazy"
                sandbox="allow-scripts allow-same-origin"
                tabIndex={-1}
              />

              {/* Confirmation overlay */}
              {isConfirming ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#002040]/80 z-10">
                  <p className="text-white text-sm font-medium mb-1">Delete this artefact?</p>
                  <p className="text-[rgba(255,255,255,0.5)] text-xs mb-4">This can't be undone.</p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleDelete(a.slug)}
                      disabled={deleting}
                      className="px-4 py-1.5 bg-[#FF6B6B] text-[#002040] text-xs font-medium rounded-md hover:opacity-85 transition-opacity disabled:opacity-40"
                    >
                      {deleting ? 'Deleting...' : 'Delete'}
                    </button>
                    <button
                      onClick={() => setConfirmSlug(null)}
                      className="px-4 py-1.5 bg-[rgba(255,255,255,0.1)] text-white text-xs font-medium rounded-md hover:bg-[rgba(255,255,255,0.15)] transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* Normal hover overlay */
                <div className="absolute inset-0 flex items-center justify-center bg-[#002040]/0 group-hover:bg-[#002040]/50 transition-all duration-300">
                  <div className="opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-4">
                    <Link
                      href={`/${a.slug}`}
                      className="flex items-center gap-1.5 text-white text-sm font-medium hover:text-[#22D3EE] transition-colors"
                    >
                      <span>View</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        setConfirmSlug(a.slug)
                      }}
                      className="flex items-center gap-1 text-[rgba(255,255,255,0.5)] text-xs font-light hover:text-[#FF6B6B] transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Card info */}
            <Link href={`/${a.slug}`} className="block px-4 py-3.5">
              <h2 className="text-white font-medium text-sm leading-snug group-hover:text-[#22D3EE] transition-colors duration-200 truncate">
                {a.title}
              </h2>
              <div className="flex items-center gap-3 mt-2">
                <span className={`inline-block px-2 py-0.5 rounded-full text-[0.65rem] font-medium tracking-wide text-white ${tc.bg}`}>
                  {tc.label}
                </span>
                <span className="text-[rgba(255,255,255,0.3)] text-xs font-light">
                  {new Date(a.date).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </Link>
          </div>
        )
      })}
    </div>
  )
}
