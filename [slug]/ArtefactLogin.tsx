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
    <main className="min-h-screen bg-[#002040] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-white text-base font-light">{title}</h1>
          <p className="text-[#cee4ff] text-sm mt-1 font-light">dotfound artefacts</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 space-y-4">
          <div>
            <label className="block text-[#002040] text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-[#f2f2f2] rounded-lg px-4 py-3 text-[#002040] text-sm focus:outline-none focus:border-[#5400ff] transition-colors"
              autoFocus
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-[#5400ff] text-white py-3 rounded-lg text-sm font-medium hover:bg-[#4400cc] transition-colors disabled:opacity-40"
          >
            {loading ? 'Checking…' : 'Enter'}
          </button>
        </form>
      </div>
    </main>
  )
}
