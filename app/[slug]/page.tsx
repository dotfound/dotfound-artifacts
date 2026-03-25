import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import manifestData from '@/data/manifest.json'
import { hashPassword } from '@/lib/crypto'
import ArtefactLogin from './ArtefactLogin'

interface Artefact {
  slug: string
  title: string
  type: string
  date: string
  has_password: boolean
  password?: string
}

export default async function ArtefactPage({
  params,
}: {
  params: { slug: string }
}) {
  const { slug } = params
  const artefact = (manifestData.artefacts as Artefact[]).find(a => a.slug === slug)

  if (!artefact) return notFound()

  if (artefact.has_password && artefact.password) {
    const secret = process.env.ARTEFACTS_SECRET ?? ''
    const expected = await hashPassword(artefact.password + secret)
    const cookieStore = cookies()
    const cookie = cookieStore.get(`df-artefact-${slug}`)

    if (cookie?.value !== expected) {
      return <ArtefactLogin slug={slug} title={artefact.title} />
    }
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Viewer nav bar */}
      <div className="flex items-center gap-4 px-5 py-2.5 shrink-0 border-b border-[rgba(255,255,255,0.06)] bg-[#002040]">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-[rgba(255,255,255,0.5)] text-xs font-light hover:text-[#22D3EE] transition-colors duration-200"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Library</span>
        </Link>
        <span className="text-[rgba(255,255,255,0.06)]">|</span>
        <span className="text-[rgba(255,255,255,0.7)] text-xs font-light truncate">{artefact.title}</span>
      </div>

      {/* Iframe */}
      <iframe
        src={`/a/${slug}.html`}
        className="flex-1 w-full border-0"
        title={artefact.title}
      />
    </div>
  )
}
