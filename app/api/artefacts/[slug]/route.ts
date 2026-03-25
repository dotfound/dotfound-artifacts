import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

interface Artefact {
  slug: string
  title: string
  type: string
  date: string
  has_password: boolean
  password?: string
}

interface Manifest {
  artefacts: Artefact[]
}

const MANIFEST_PATH = path.join(process.cwd(), 'data', 'manifest.json')

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params

  try {
    const raw = await fs.readFile(MANIFEST_PATH, 'utf-8')
    const manifest: Manifest = JSON.parse(raw)

    const index = manifest.artefacts.findIndex((a) => a.slug === slug)
    if (index === -1) {
      return NextResponse.json({ error: 'Artefact not found' }, { status: 404 })
    }

    // Remove from manifest
    manifest.artefacts.splice(index, 1)
    await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2))

    // Delete the HTML file if it exists
    const htmlPath = path.join(process.cwd(), 'public', 'a', `${slug}.html`)
    try {
      await fs.unlink(htmlPath)
    } catch {
      // File may not exist, that's fine
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete artefact' }, { status: 500 })
  }
}
