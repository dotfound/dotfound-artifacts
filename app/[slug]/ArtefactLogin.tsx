'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ArtefactLogin({
  slug,
  title,
}: {
  slug: string
  title: string
}) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'artefact', slug, password }),
    })

    if (res.ok) {
      router.refresh()
    } else {
      setError('Incorrect password')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-[rgba(255,255,255,0.95)] text-base font-medium">{title}</h1>
          <p className="text-[rgba(255,255,255,0.35)] text-sm mt-1.5 font-light">This artefact is password protected</p>
        </div>
        <form onSubmit={handleSubmit} className="rounded-lg border border-[rgba(255,255,255,0.09)] bg-[rgba(255,255,255,0.04)] p-8 space-y-5">
          <div>
            <label className="block text-[rgba(255,255,255,0.6)] text-xs font-light mb-2 tracking-wide">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.09)] rounded-md px-4 py-3 text-[rgba(255,255,255,0.9)] text-sm font-light focus:outline-none focus:border-[#22D3EE] transition-colors placeholder:text-[rgba(255,255,255,0.2)]"
              placeholder="Enter password"
              autoFocus
            />
          </div>
          {error && <p className="text-[#FF6B6B] text-sm font-light">{error}</p>}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-[#FF6B6B] text-[#002040] py-3 rounded-md text-sm font-medium hover:opacity-85 transition-opacity disabled:opacity-30"
          >
            {loading ? 'Checking...' : 'Enter'}
          </button>
        </form>
      </div>
    </main>
  )
}
