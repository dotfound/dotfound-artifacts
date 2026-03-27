import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import manifestData from '@/data/manifest.json'

export const runtime = 'edge'

interface Artefact {
  slug: string
  title: string
  type: string
  date: string
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')

  const artefact = slug
    ? (manifestData.artefacts as Artefact[]).find(a => a.slug === slug)
    : null

  const title = artefact?.title ?? 'dotfound artefacts'
  const type = artefact?.type ?? ''
  const date = artefact?.date ?? ''

  const typeLabel: Record<string, string> = {
    dashboard: 'Dashboard',
    report: 'Report',
    proposal: 'Proposal',
    other: 'Artefact',
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#002040',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top: logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '6px',
              height: '32px',
              background: '#cee4ff',
              borderRadius: '2px',
            }}
          />
          <span style={{ color: '#cee4ff', fontSize: '18px', fontWeight: 300, letterSpacing: '0.05em' }}>
            dotfound artefacts
          </span>
        </div>

        {/* Middle: title */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {type && (
            <span
              style={{
                color: '#4a90b8',
                fontSize: '16px',
                fontWeight: 400,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
              }}
            >
              {typeLabel[type] ?? type}{date ? `  ·  ${date}` : ''}
            </span>
          )}
          <span
            style={{
              color: '#ffffff',
              fontSize: title.length > 40 ? '48px' : '60px',
              fontWeight: 600,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </span>
        </div>

        {/* Bottom: URL */}
        <span style={{ color: '#2a5a7a', fontSize: '18px', fontWeight: 300 }}>
          artefacts.dotfound.co.uk
        </span>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
