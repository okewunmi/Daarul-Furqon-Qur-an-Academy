'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, Video } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Group } from '@/types'

export default function NewSessionPage() {
  const router = useRouter()
  const supabase = createClient()
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    group_id: '',
    title: '',
    description: '',
    session_date: '',
    start_time: '',
    end_time: '',
    meet_link: '',
    recording_link: '',
  })

  useEffect(() => {
    supabase.from('groups').select('*').eq('is_active', true).then(({ data }) => setGroups(data || []))
  }, [])

  const update = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { error: err } = await supabase.from('sessions').insert({
        ...form,
        recording_link: form.recording_link || null,
        description: form.description || null,
        created_by: user?.id,
      })
      if (err) throw err
      router.push('/admin/sessions')
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/sessions" className="p-2 text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-emerald-900">Schedule New Session</h1>
          <p className="text-gray-500 text-sm">Add a class with a Google Meet link for a group.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        <div>
          <label className="label-field">Group *</label>
          <select className="input-field" value={form.group_id} onChange={e => update('group_id', e.target.value)} required>
            <option value="">Select group...</option>
            {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </div>

        <div>
          <label className="label-field">Session Title *</label>
          <input className="input-field" placeholder="e.g. Tajweed Rules – Week 3" value={form.title} onChange={e => update('title', e.target.value)} required />
        </div>

        <div>
          <label className="label-field">Description (optional)</label>
          <textarea className="input-field min-h-20 resize-none" placeholder="Topics to be covered..." value={form.description} onChange={e => update('description', e.target.value)} />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="label-field">Date *</label>
            <input type="date" className="input-field" value={form.session_date} onChange={e => update('session_date', e.target.value)} required />
          </div>
          <div>
            <label className="label-field">Start Time *</label>
            <input type="time" className="input-field" value={form.start_time} onChange={e => update('start_time', e.target.value)} required />
          </div>
          <div>
            <label className="label-field">End Time *</label>
            <input type="time" className="input-field" value={form.end_time} onChange={e => update('end_time', e.target.value)} required />
          </div>
        </div>

        <div>
          <label className="label-field">Google Meet Link *</label>
          <div className="relative">
            <Video className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="url"
              className="input-field pl-10"
              placeholder="https://meet.google.com/..."
              value={form.meet_link}
              onChange={e => update('meet_link', e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="label-field">Recording Link (optional — add after class)</label>
          <input type="url" className="input-field" placeholder="https://..." value={form.recording_link} onChange={e => update('recording_link', e.target.value)} />
        </div>

        {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm">{error}</div>}

        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? 'Scheduling...' : 'Schedule Session'}
        </button>
      </form>
    </div>
  )
}
