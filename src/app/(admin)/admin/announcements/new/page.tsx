'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, Bell, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Group } from '@/types'

export default function NewAnnouncementPage() {
  const router = useRouter()
  const supabase = createClient()
  const [groups, setGroups] = useState<Group[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    title: '',
    content: '',
    priority: 'normal',
    target_group: '',
    expires_at: '',
  })

  useEffect(() => {
    supabase
      .from('groups')
      .select('*')
      .eq('is_active', true)
      .order('name')
      .then(({ data }) => setGroups(data || []))
  }, [])

  const update = (key: string, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()

      const { error: err } = await supabase.from('announcements').insert({
        title: form.title,
        content: form.content,
        priority: form.priority,
        target_group: form.target_group || null,
        expires_at: form.expires_at || null,
        author_id: user?.id,
        is_active: true,
      })

      if (err) throw err

      setSaved(true)
      setTimeout(() => router.push('/admin/announcements'), 1500)
    } catch (e: any) {
      setError(e.message || 'Failed to post announcement.')
    } finally {
      setSaving(false)
    }
  }

  const priorityOptions = [
    {
      value: 'normal',
      label: 'Normal',
      desc: 'General info or updates',
      icon: '🟢',
      style: 'border-emerald-200 bg-emerald-50',
      activeStyle: 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200',
    },
    {
      value: 'important',
      label: 'Important',
      desc: 'Needs attention soon',
      icon: '🟡',
      style: 'border-gold-200 bg-gold-50',
      activeStyle: 'border-gold-500 bg-gold-50 ring-2 ring-gold-200',
    },
    {
      value: 'urgent',
      label: 'Urgent',
      desc: 'Immediate action required',
      icon: '🔴',
      style: 'border-red-200 bg-red-50',
      activeStyle: 'border-red-500 bg-red-50 ring-2 ring-red-200',
    },
  ]

  if (saved) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="font-display text-2xl font-bold text-emerald-900 mb-2">
            Announcement Posted!
          </h2>
          <p className="text-gray-500 text-sm">
            Redirecting to announcements...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/announcements"
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-emerald-900">
            New Announcement
          </h1>
          <p className="text-gray-500 text-sm">
            Post a message to all students or a specific group.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title & Content */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
          <h3 className="font-semibold text-emerald-800">Message Content</h3>

          <div>
            <label className="label-field">Title *</label>
            <input
              className="input-field"
              placeholder="e.g. Class rescheduled this Saturday"
              value={form.title}
              onChange={e => update('title', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label-field">Message *</label>
            <textarea
              className="input-field resize-none min-h-32"
              placeholder="Write your announcement here..."
              value={form.content}
              onChange={e => update('content', e.target.value)}
              required
            />
          </div>
        </div>

        {/* Priority */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-semibold text-emerald-800 mb-4">Priority Level</h3>
          <div className="grid grid-cols-3 gap-3">
            {priorityOptions.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => update('priority', opt.value)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  form.priority === opt.value ? opt.activeStyle : opt.style
                }`}
              >
                <div className="text-xl mb-1">{opt.icon}</div>
                <div className="font-semibold text-gray-800 text-sm">{opt.label}</div>
                <div className="text-gray-500 text-xs mt-0.5">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Target & Expiry */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h3 className="font-semibold text-emerald-800">Delivery Settings</h3>

          <div>
            <label className="label-field">Send To</label>
            <select
              className="input-field"
              value={form.target_group}
              onChange={e => update('target_group', e.target.value)}
            >
              <option value="">🌍 All Students</option>
              {groups.map(g => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-1">
              Leave as "All Students" to send to everyone, or select a specific group.
            </p>
          </div>

          <div>
            <label className="label-field">Expires On (optional)</label>
            <input
              type="datetime-local"
              className="input-field"
              value={form.expires_at}
              onChange={e => update('expires_at', e.target.value)}
            />
            <p className="text-xs text-gray-400 mt-1">
              Leave blank to keep the announcement active indefinitely.
            </p>
          </div>
        </div>

        {/* Preview */}
        {form.title && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-semibold text-emerald-800 mb-3">Preview</h3>
            <div className={`rounded-xl p-4 border-l-4 ${
              form.priority === 'urgent'
                ? 'bg-red-50 border-red-500'
                : form.priority === 'important'
                ? 'bg-gold-50 border-gold-500'
                : 'bg-emerald-50 border-emerald-500'
            }`}>
              <div className="flex items-start gap-2">
                <Bell className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{form.title}</p>
                  {form.content && (
                    <p className="text-gray-600 text-xs mt-1 leading-relaxed">{form.content}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                      form.priority === 'urgent'
                        ? 'bg-red-100 text-red-600'
                        : form.priority === 'important'
                        ? 'bg-gold-100 text-gold-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {form.priority}
                    </span>
                    <span className="text-xs text-gray-400">
                      → {form.target_group
                          ? groups.find(g => g.id === form.target_group)?.name || 'Selected group'
                          : 'All Students'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Submit */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving || !form.title || !form.content}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <Bell className="w-4 h-4" />
            }
            {saving ? 'Posting...' : 'Post Announcement'}
          </button>
          <Link href="/admin/announcements" className="btn-outline">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}