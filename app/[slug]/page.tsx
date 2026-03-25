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
    <iframe
      src={`/a/${slug}.html`}
      className="w-full h-screen border-0"
      title={artefact.title}
    />
  )
}
