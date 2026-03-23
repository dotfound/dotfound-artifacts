import { NextRequest, NextResponse } from 'next/server'
import manifestData from '@/data/manifest.json'
import { hashPassword } from '@/lib/crypto'

interface Artefact {
  slug: string
  has_password: boolean
  password?: string
}

const INDEX_COOKIE = 'df-index-auth'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

export async function POST(request: NextRequest) {
  const { type, slug, password } = (await request.json()) as {
    type: 'index' | 'artefact'
    slug?: string
    password: string
  }

  const secret = process.env.ARTEFACTS_SECRET ?? ''
  const isProd = process.env.NODE_ENV === 'production'

  if (type === 'index') {
    const indexPassword = process.env.INDEX_PASSWORD
    if (!indexPassword || password !== indexPassword) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
    }
    const hashed = await hashPassword(password + secret)
    const response = NextResponse.json({ ok: true })
    response.cookies.set(INDEX_COOKIE, hashed, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    })
    return response
  }

  if (type === 'artefact' && slug) {
    const artefact = (manifestData.artefacts as Artefact[]).find(a => a.slug === slug)
    if (!artefact?.has_password || !artefact.password || password !== artefact.password) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
    }
    const hashed = await hashPassword(password + secret)
    const response = NextResponse.json({ ok: true })
    response.cookies.set(`df-artefact-${slug}`, hashed, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: `/${slug}`,
    })
    return response
  }

  return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
}
