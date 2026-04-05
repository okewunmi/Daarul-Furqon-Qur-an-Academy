'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, Save, Video, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Group } from '@/types'

export default function EditSessionPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const sessionId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [groups, setGroups] = useState<Group[]>([])

  const [form, setForm] = useState({
    group_id: '',
    title: '',
    description: '',
    session_date: '',
    start_time: '',
    end_time: '',
    meet_link: '',
    recording_link: '',
    is_cancelled: false,
    cancel_reason: '',
  })

  useEffect(() => {
    const load = async () => {
      const [{ data: session }, { data: grps }] = await Promise.all([
        supabase.from('sessions').select('*').eq('id', sessionId).single(),
        supabase.from('groups').select('*').eq('is_active', true).order('name'),
      ])

      if (!session) { setNotFound(true); setLoading(false); return }

      setGroups(grps || [])
      setForm({
        group_id: session.group_id || '',
        title: session.title || '',
        description: session.description || '',
        session_date: session.session_date || '',
        start_time: session.start_time || '',
        end_time: session.end_time || '',
        meet_link: session.meet_link || '',
        recording_link: session.recording_link || '',
        is_cancelled: session.is_cancelled || false,
        cancel_reason: session.cancel_reason || '',
      })
      setLoading(false)
    }
    load()
  }, [sessionId])

  const update = (key: string, value: string | boolean) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const { error: err } = await supabase.from('sessions').update({
        group_id: form.group_id,
        title: form.title,
        description: form.description || null,
        session_date: form.session_date,
        start_time: form.start_time,
        end_time: form.end_time,
        meet_link: form.meet_link,
        recording_link: form.recording_link || null,
        is_cancelled: form.is_cancelled,
        cancel_reason: form.is_cancelled ? (form.cancel_reason || null) : null,
      }).eq('id', sessionId)

      if (err) throw err
      setSaved(true)
      setTimeout(() => router.push('/admin/sessions'), 1500)
    } catch (e: any) {
      setError(e.message || 'Failed to save session.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
    </div>
  )

  if (notFound) return (
    <div className="max-w-lg">
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
        <p className="text-gray-500 mb-4">Session not found.</p>
        <Link href="/admin/sessions" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Sessions
        </Link>
      </div>
    </div>
  )

  if (saved) return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="font-display text-2xl font-bold text-emerald-900 mb-2">Session Updated!</h2>
        <p className="text-gray-500 text-sm">Redirecting to sessions...</p>
      </div>
    </div>
  )

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin/sessions" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-emerald-900">Edit Session</h1>
          <p className="text-gray-500 text-sm">Update class details, Meet link, or recording.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        {/* Group */}
        <div>
          <label className="label-field">Group *</label>
          <select className="input-field" value={form.group_id} onChange={e => update('group_id', e.target.value)} required>
            <option value="">Select group...</option>
            {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </div>

        {/* Title */}
        <div>
          <label className="label-field">Session Title *</label>
          <input
            className="input-field"
            placeholder="e.g. Tajweed Rules – Week 3"
            value={form.title}
            onChange={e => update('title', e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="label-field">Description (optional)</label>
          <textarea
            className="input-field min-h-20 resize-none"
            placeholder="Topics to be covered..."
            value={form.description}
            onChange={e => update('description', e.target.value)}
          />
        </div>

        {/* Date + Times */}
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

        {/* Meet link */}
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

        {/* Recording link */}
        <div>
          <label className="label-field">Recording Link (optional)</label>
          <input
            type="url"
            className="input-field"
            placeholder="https://..."
            value={form.recording_link}
            onChange={e => update('recording_link', e.target.value)}
          />
          <p className="text-xs text-gray-400 mt-1">Add after the class is over.</p>
        </div>

        {/* Cancel toggle */}
        <div className={`rounded-xl p-4 border-2 transition-all ${form.is_cancelled ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-100'}`}>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_cancelled}
              onChange={e => update('is_cancelled', e.target.checked)}
              className="w-4 h-4 accent-red-500"
            />
            <span className={`font-semibold text-sm ${form.is_cancelled ? 'text-red-700' : 'text-gray-700'}`}>
              Mark this session as cancelled
            </span>
          </label>
          {form.is_cancelled && (
            <div className="mt-3">
              <input
                className="input-field bg-white"
                placeholder="Reason for cancellation (optional)..."
                value={form.cancel_reason}
                onChange={e => update('cancel_reason', e.target.value)}
              />
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm">{error}</div>
        )}

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Session'}
          </button>
          <Link href="/admin/sessions" className="btn-outline">Cancel</Link>
        </div>
      </form>
    </div>
  )
}