import { Metadata } from 'next'
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

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const artefact = (manifestData.artefacts as Artefact[]).find(
    a => a.slug === params.slug
  )
  if (!artefact) return {}
  return {
    title: `${artefact.title} | dotfound artefacts`,
    openGraph: {
      title: artefact.title,
      siteName: 'dotfound artefacts',
      images: [{ url: '/og-image.png' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: artefact.title,
      images: ['/og-image.png'],
    },
  }
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
    <div className="flex flex-col h-screen bg-[#002040]">
      <div className="flex items-center gap-4 px-5 py-2.5 shrink-0">
        <Link
          href="/"
          className="text-[#cee4ff] text-xs font-light hover:text-white transition-colors"
        >
          ← library
        </Link>
        <span className="text-[#767676] text-xs font-light">{artefact.title}</span>
      </div>
      <iframe
        src={`/a/${slug}.html`}
        className="flex-1 w-full border-0 bg-white"
        title={artefact.title}
      />
    </div>
  )
}
